import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/common/entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(@InjectModel('Blog') private readonly blogModel: Model<Blog>) {}

  // list all blogs
  async findAll() {
    const blogs = await this.blogModel
      .find()
      .populate('createdBy updatedBy')
      .exec();
    if (!blogs || blogs.length === 0) {
      throw new NotFoundException('No blogs found');
    }
    const listBlogs = blogs.map((blog) => {
      return {
        title: blog.title,
        createdBy: blog.createdBy.fullName,
        summary: blog.summary,
        destination: blog.tripId?.description,
        viewCount: blog.metrics?.viewCount || 0,
        likeCount: blog.metrics?.likeCount || 0,
        commentCount: blog.metrics?.commentCount || 0,
        status: blog.status,
        flags: blog.flags?.length || 0,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      };
    });
    return listBlogs;
  }

  async updateMetrics(blogId: string, reqUserId?: string) {
    const blog = await this.blogModel
      .findById(blogId)
      .populate('createdBy')
      .exec();

    if (!blog) throw new NotFoundException('Blog not found');

    // Đếm lại số lượng like và comment
    const likeCount = blog.likes ? blog.likes.length : 0;
    const commentCount = blog.comments ? blog.comments.length : 0;

    // Xử lý viewCount: chỉ tăng nếu người xem không phải là người tạo blog
    let viewCount = blog.metrics?.viewCount || 0;
    if (
      reqUserId &&
      blog.createdBy &&
      blog.createdBy.userId?.toString() !== reqUserId
    ) {
      viewCount++;
    }

    blog.metrics = {
      likeCount,
      commentCount,
      viewCount,
    };

    await blog.save();

    // Trả về thông tin cập nhật
    return blog.metrics;
  }
}
