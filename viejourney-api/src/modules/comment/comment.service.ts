import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model, Types } from 'mongoose';
import { Blog } from 'src/common/entities/blog.entity';
import { Comment } from 'src/common/entities/comment.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<Comment>,
    @InjectModel('Blog') private blogModel: Model<Blog>,
    @InjectModel('UserInfos') private userInfosModel: Model<UserInfos>,
  ) {}

  async createComment(
    blogId: string,
    content: string,
    req: Request,
    parentId?: string,
  ) {
    const userId = req.user?.['userId'] as string;
    const userInfos = await this.userInfosModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    // 1. Kiểm tra Blog tồn tại
    const blog = await this.blogModel.findById(blogId);
    if (!blog) throw new NotFoundException('Blog not found');

    let parentComment: any = null;
    if (parentId) {
      // 2. Kiểm tra comment cha tồn tại
      parentComment = await this.commentModel.findById(parentId);
      if (!parentComment)
        throw new NotFoundException('Parent comment not found');
    }

    // 3. Tạo comment mới
    const commentData: any = {
      blogId: new Types.ObjectId(blogId),
      content,
      commentBy: userInfos?._id,
      totalReplies: 0,
      totalChildren: 0,
      likes: [],
      edited: false,
      editedAt: null,
      replies: [],
    };

    if (parentId) {
      commentData.parentId = new Types.ObjectId(parentId);
    } else {
      commentData.parentId = null;
    }

    const comment = await this.commentModel.create(commentData);

    // 4. Nếu là reply, cập nhật replies, totalReplies và totalChildren cho các comment cha
    if (parentComment) {
      // Thêm _id của reply vào mảng replies của comment cha
      parentComment.replies.push(comment._id);
      parentComment.totalReplies += 1;
      await parentComment.save();

      // Tăng tổng số reply (bao gồm cả reply lồng nhau) cho tất cả các cha
      let currentParent: any = parentComment;
      while (currentParent) {
        currentParent.totalChildren += 1;
        await currentParent.save();
        if (currentParent.parentId) {
          currentParent = await this.commentModel.findById(
            currentParent.parentId,
          );
        } else {
          currentParent = null;
        }
      }
    }

    // 5. Cập nhật tổng số comment trong Blog (nếu có trường này)
    if (blog.metrics) {
      blog.metrics.commentCount = (blog.metrics.commentCount || 0) + 1;
      await blog.save();
    }

    return comment;
  }

  async getComments(blogId: string, parentId?: string, limit = 10, skip = 0) {
    const query: any = { blogId: new Types.ObjectId(blogId) };
    if (parentId) {
      query.parentId = new Types.ObjectId(parentId);
    } else {
      // Lấy comment gốc (parentId là null hoặc không tồn tại)
      query.$or = [{ parentId: null }, { parentId: { $exists: false } }];
    }
    // Lấy comment gốc hoặc reply theo parentId
    return this.commentModel
      .find(query)
      .populate({
        path: 'commentBy',
        select: 'fullName avatar',
        populate: {
          path: 'avatar',
          model: 'Asset',
          select: 'url',
        },
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .then((comments) =>
        comments.map((comment) => ({
          ...comment,
          commentBy: {
            ...comment.commentBy,
            avatar: comment.commentBy?.avatar?.url || null, // Nếu không có avatar thì là null
          },
        })),
      );
  }

  async editComment(commentId: string, userId: string, content: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    const userInfos = await this.userInfosModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (comment.commentBy.toString() !== userInfos?._id.toString())
      throw new ForbiddenException('No permission');
    comment.content = content;
    comment.edited = true;
    comment.editedAt = new Date();
    await comment.save();
    return comment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    const userInfos = await this.userInfosModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (comment.commentBy.toString() !== userInfos?._id.toString())
      throw new ForbiddenException('No permission');

    // 1. Xóa đệ quy tất cả reply con cháu
    await this.deleteCommentAndChildren(commentId);

    // 2. Nếu có parent, cập nhật lại replies, totalReplies, totalChildren cho cha và các ông cha
    if (comment.parentId) {
      // Xóa _id khỏi mảng replies của cha
      await this.commentModel.findByIdAndUpdate(comment.parentId, {
        $pull: { replies: comment._id },
        $inc: { totalReplies: -1 },
      });

      // Giảm totalChildren cho tất cả các cha trong chuỗi
      let currentParent = await this.commentModel.findById(comment.parentId);
      // Số lượng comment con cháu bị xóa (bao gồm chính nó)
      const totalDeleted = await this.countCommentAndChildren(commentId);
      while (currentParent) {
        currentParent.totalChildren -= totalDeleted;
        await currentParent.save();
        if (currentParent.parentId) {
          currentParent = await this.commentModel.findById(
            currentParent.parentId,
          );
        } else {
          currentParent = null;
        }
      }
    }

    // 3. Giảm metrics.commentCount trong Blog
    const blog = await this.blogModel.findById(comment.blogId);
    if (blog && blog.metrics) {
      // Đếm tổng số comment bị xóa (bao gồm chính nó và các con cháu)
      const totalDeleted = await this.countCommentAndChildren(commentId);
      blog.metrics.commentCount -= totalDeleted;
      if (blog.metrics.commentCount < 0) blog.metrics.commentCount = 0;
      console.log(`Total comments deleted: ${totalDeleted}`);
      console.log(`New comment count: ${blog.metrics.commentCount}`);
      await blog.save();
    }

    return { success: true };
  }

  async likeComment(commentId: string, userId: string) {
    const userInfos = await this.userInfosModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    // Kiểm tra đã like chưa
    if (
      comment.likes.some((id) => id.toString() === userInfos?._id.toString())
    ) {
      // Sau khi like, vẫn trả về danh sách fullName hiện tại
      return await this.getLikeFullNames(commentId);
    }

    comment.likes.push(new Types.ObjectId(userInfos?._id));
    await comment.save();

    return await this.getLikeFullNames(commentId);
  }

  async unlikeComment(commentId: string, userId: string) {
    const userInfos = await this.userInfosModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    // Tìm vị trí userId trong mảng likes
    const index = comment.likes.findIndex(
      (id) => id.toString() === userInfos?._id.toString(),
    );
    if (index === -1) {
      // Nếu chưa like, vẫn trả về danh sách fullName hiện tại
      return await this.getLikeFullNames(commentId);
    }

    comment.likes.splice(index, 1);
    await comment.save();

    return await this.getLikeFullNames(commentId);
  }

  // Hàm lấy mảng fullName của những người đã like
  private async getLikeFullNames(
    commentId: string,
  ): Promise<{ likes: string[]; likesCount: number }> {
    const comment = await this.commentModel
      .findById(commentId)
      .populate({ path: 'likes', select: 'fullName' })
      .lean();
    if (!comment || !comment.likes) return { likes: [], likesCount: 0 };
    const fullNames = (comment.likes as any[]).map((user) => user.fullName);
    return {
      likes: fullNames,
      likesCount: fullNames.length,
    };
  }

  private async deleteCommentAndChildren(commentId: string) {
    const _commentId = new Types.ObjectId(commentId);
    const replies = (await this.commentModel.find({
      parentId: _commentId,
    })) as (Comment & { _id: Types.ObjectId })[];
    for (const reply of replies) {
      await this.deleteCommentAndChildren(reply._id.toString());
    }
    await this.commentModel.findByIdAndDelete(_commentId);
  }

  private async countCommentAndChildren(commentId: string): Promise<number> {
    const _commentId = new Types.ObjectId(commentId);
    let count = 1;
    const replies = (await this.commentModel.find({
      parentId: _commentId,
    })) as (Comment & { _id: Types.ObjectId })[];
    for (const reply of replies) {
      count += await this.countCommentAndChildren(reply._id.toString());
    }
    return count;
  }
}
