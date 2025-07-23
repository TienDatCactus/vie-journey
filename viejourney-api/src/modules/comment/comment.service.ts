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

  async createComment(blogId: string, content: string, userId: string) {
    const userInfos = await this.userInfosModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    const blog = await this.blogModel.findById(blogId);
    if (!blog) throw new NotFoundException('Blog not found');
    const commentData: Comment = {
      blogId: new Types.ObjectId(blogId),
      content,
      commentBy: userInfos?._id as Types.ObjectId,
      likes: [],
      edited: false,
      editedAt: null,
    };

    const comment = (await this.commentModel.create(commentData)).populate({
      path: 'commentBy',
      select: 'fullName avatar',
      populate: {
        path: 'avatar',
        model: 'Asset',
        select: 'url',
      },
    });
    console.log(comment);
    return comment;
  }

  async getComments(
    blogId: string,
    limit?: number,
    skip?: number,
  ): Promise<Comment[]> {
    // Gán giá trị mặc định nếu không truyền vào
    const limitValue = limit !== undefined ? limit : 10;
    const skipValue = skip !== undefined ? skip : 0;

    // Lấy toàn bộ comments từ đầu đến skip+limit
    const totalToFetch = skipValue + limitValue;

    const comments = await this.commentModel
      .find({
        blogId: new Types.ObjectId(blogId),
      })
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
      .limit(totalToFetch)
      .lean();
    return comments;
  }

  async editComment(commentId: string, userId: string, content: string) {
    const comment = await this.commentModel.findById(commentId).populate({
      path: 'commentBy',
      select: 'fullName avatar',
      populate: {
        path: 'avatar',
        model: 'Asset',
        select: 'url',
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');
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

    await this.deleteCommentAndChildren(commentId);

    const blog = await this.blogModel.findById(comment.blogId);
    if (blog && blog.metrics) {
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
