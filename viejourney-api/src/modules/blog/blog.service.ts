import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/common/entities/blog.entity';
import { Status } from 'src/common/enums/status.enum';
import { Account } from 'src/common/entities/account.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { CreateBlogDto } from 'src/common/dtos/create-blog.dto';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    private readonly assetsService: AssetsService,
  ) {}

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
        _id: blog._id,
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

  // view blog detail by id
  async findOneBlogById(blogId: string) {
    const blog = await this.blogModel
      .findById(blogId)
      .populate('createdBy updatedBy')
      .exec();

    if (!blog) throw new NotFoundException('Blog not found');

    return {
      title: blog.title,
      content: blog.content,
      createdBy: blog.createdBy.fullName,
      summary: blog.summary,
      coverImage: blog.coverImage,
      tripId: blog.tripId,
      destination: blog.tripId?.description,
      flags: blog.flags || [],
    };
  }

  // update status of blog by id
  async updateStatus(blogId: string, status: 'APPROVED' | 'REJECTED') {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) throw new NotFoundException('Blog not found');

    blog.status = status;
    await blog.save();

    return {
      _id: blog._id,
      title: blog.title,
      status: blog.status,
    };
  }

  // clean flags of blog by id
  async cleanFlags(blogId: string) {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) throw new NotFoundException('Blog not found');

    blog.flags = [];
    await blog.save();

    return {
      _id: blog._id,
      title: blog.title,
      flags: blog.flags,
    };
  }

  // /blogs/ban-author/:id
  async banAuthor(blogId: string, reason: string) {
    try {
      const blog = await this.blogModel
        .findById(blogId)
        .populate({
          path: 'createdBy',
          populate: {
            path: 'userId', // userId là ref tới Account
            model: 'Account',
            select: 'role', // chỉ lấy trường role nếu muốn
          },
        })
        .exec();
      if (!blog) {
        throw new NotFoundException('Blog not found');
      }
      if (
        blog.createdBy &&
        blog.createdBy.userId &&
        (blog.createdBy.userId.role === 'ADMIN' ||
          blog.createdBy.userId.role === 'MANAGER')
      ) {
        throw new NotFoundException('Cannot ban admin or manager author');
      } else if (
        blog.createdBy &&
        blog.createdBy.userId &&
        blog.createdBy.userId.role === 'USER'
      ) {
        // Fetch the Account document to ensure 'save' is available
        const account = await this.accountModel.findById(
          blog.createdBy.userId._id,
        );
        if (account) {
          account.status = Status.banned;
          await account.save();
        }
        const userInfo = await this.userInfosModel.findById(blog.createdBy._id);
        if (userInfo) {
          userInfo.banReason = reason;
          userInfo.bannedAt = new Date();
          await userInfo.save();
        }
        return {
          _id: blog._id,
          reasonBan: userInfo ? userInfo.banReason : blog.createdBy.banReason,
          bannedAt: userInfo ? userInfo.bannedAt : blog.createdBy.bannedAt,
          status: account ? account.status : blog.createdBy.userId.status,
        };
      }
    } catch (error) {
      throw new NotFoundException('Blog not found');
    }
  }

  // delete blog by id
  async deleteBlogById(blogId: string) {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) throw new NotFoundException('Blog not found');
    await this.blogModel.deleteOne({ _id: blogId }).exec();
    return { message: 'Blog deleted successfully' };
  }

  // create a new blog
  async createBlog(
    createBlogDto: CreateBlogDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    try {
      let uploadResult: import('cloudinary').UploadApiResponse | null = null;
      uploadResult = await this.assetsService.uploadImage(file, {
        public_id: `users/${userId}/IMAGE_BLOG/${file.filename}`,
      });
      const newBlog = new this.blogModel({
        ...createBlogDto,
        createdBy: new Types.ObjectId(userId),
        updatedBy: new Types.ObjectId(userId),
        coverImage: uploadResult?.secure_url || '',
        status: 'APPROVED',
        metrics: {
          likeCount: 0,
          commentCount: 0,
          viewCount: 0,
        },
        flags: [],
        comments: [],
      });
      const createdBlog = await newBlog.save();
      return createdBlog;
    } catch (error) {
      throw new NotFoundException('Error creating blog');
    }
  }
}
