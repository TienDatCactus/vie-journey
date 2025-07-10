import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';
import { Blog } from 'src/common/entities/blog.entity';
import { Comment } from 'src/common/entities/comment.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<Comment>,
    @InjectModel('Blog') private blogModel: Model<Blog>,
  ) {}

  async createComment(
    blogId: string,
    req: Request,
    content: string,
    parentId?: string,
  ) {
    const userId = req.user?.['userId'] as string;
    // 1. Kiểm tra Blog tồn tại
    const blog = await this.blogModel.findById(blogId);
    console.log('Blog ID:', blogId);
    if (!blog) throw new NotFoundException('Blog not found');

    let parentComment: any = null;
    if (parentId) {
      // 2. Kiểm tra comment cha tồn tại
      parentComment = await this.commentModel.findById(parentId);
      if (!parentComment)
        throw new NotFoundException('Parent comment not found');
    }

    // 3. Tạo comment mới
    const comment = await this.commentModel.create({
      blogId,
      content,
      commentBy: userId,
      parentId: parentId || null,
      totalReplies: 0,
      totalChildren: 0,
      likes: [],
      edited: false,
      editedAt: null,
    });

    // 4. Nếu là reply, cập nhật totalReplies và totalChildren cho các comment cha
    if (parentComment) {
      // Tăng số reply trực tiếp cho cha
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
}
