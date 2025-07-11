import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/common/entities/blog.entity';
import { Status } from 'src/common/enums/status.enum';
import { Account } from 'src/common/entities/account.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { CreateBlogDto } from 'src/common/dtos/create-blog.dto';
import { AssetsService } from '../assets/assets.service';
import { v4 as uuidv4 } from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination-userlist.dto';
import { Request } from 'express';
import { Like } from 'src/common/entities/like.entity';
@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Like') private readonly likeModel: Model<Like>,
    private readonly assetsService: AssetsService,
  ) {}
  // check if user has liked a blog
  async hasUserLikedBlog(userId: string, blogId: string): Promise<boolean> {
    const like = await this.likeModel.findOne({ userId, blogId }).exec();
    return !!like;
  }
  // Create like blog
  // Hàm like blog
  async postLikeBlog(req: Request, blogId: string) {
    try {
      const userId = req.user?.['userId'] as string;
      if (!userId) throw new BadRequestException('User ID not found');
      // 1. Tạo like mới (nếu chưa tồn tại)
      const like = await this.likeModel.create({ userId, blogId });

      // 2. Thêm like vào blog và tăng likeCount
      await this.blogModel.findByIdAndUpdate(
        blogId,
        {
          $addToSet: { likes: like._id },
          $inc: { 'metrics.likeCount': 1 }, // Tăng likeCount lên 1
        },
        { new: true },
      );

      return {
        like: like,
        message: 'Blog liked successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error liking blog: ' + error.message);
    }
  }

  // Hàm unlike blog
  async unlikeBlog(req: Request, blogId: string) {
    const userId = req.user?.['userId'] as string;
    // 1. Xóa like trong bảng Like
    const like = await this.likeModel.findOneAndDelete({ userId, blogId });

    // 2. Nếu like tồn tại, xóa reference trong blog và giảm likeCount
    if (like) {
      await this.blogModel.findByIdAndUpdate(blogId, {
        $pull: { likes: like._id },
        $inc: { 'metrics.likeCount': -1 }, // Giảm likeCount đi 1
      });
    }

    return { message: 'Blog unliked successfully' };
  }

  // list all blogs
  async findAll(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const pageSize = paginationDto.pageSize ?? 10;
    const status = paginationDto.status?.trim();
    const viewCountRange = paginationDto.viewCountRange;
    const search = paginationDto.search?.trim();
    const sort = paginationDto.sort || 'desc';
    // Tạo query filter
    const filter: any = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // tìm kiếm không phân biệt hoa thường
    }
    const skip = (page - 1) * pageSize;
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // tìm kiếm không phân biệt hoa thường
    }
    if (status) {
      filter.status = status;
    }
    if (viewCountRange) {
      if (viewCountRange === 'lt100') {
        filter['metrics.viewCount'] = { $lt: 100 };
      } else if (viewCountRange === '100to1000') {
        filter['metrics.viewCount'] = { $gte: 100, $lte: 1000 };
      } else if (viewCountRange === 'gt1000') {
        filter['metrics.viewCount'] = { $gt: 1000 };
      }
    }
    const sortOption = sort === 'asc' ? 1 : -1;

    const [blogs, totalItems] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort({ updatedAt: sortOption })
        .skip(skip)
        .limit(pageSize)
        .populate('createdBy')
        .populate({
          path: 'createdBy',
          populate: {
            path: 'avatar',
            model: 'Asset',
            select: 'url',
          },
        })
        .exec(),
      this.blogModel.countDocuments(filter).exec(),
    ]);
    const totalPages = Math.ceil(totalItems / pageSize);

    // Nếu vượt quá số trang, trả về mảng rỗng và thông báo hợp lý
    if (page > totalPages && totalItems > 0) {
      return {
        data: [],
        totalPages,
        currentPage: page,
        pageSize: pageSize,
        totalItems,
        message:
          'Page exceeds total number of pages, no blogs found for this page.',
      };
    }

    // Nếu không có blog nào trong hệ thống
    if (totalItems === 0) {
      return {
        data: [],
        totalPages: 0,
        currentPage: page,
        pageSize: pageSize,
        totalItems: 0,
        message: 'No blogs found in the system.',
      };
    }
    const listBlogs = blogs.map((blog) => {
      return {
        _id: blog._id,
        title: blog.title,
        createdBy: blog?.createdBy,
        avatarUser: blog?.createdBy?.avatar?.url || null,
        summary: blog.summary,
        destination: blog?.destination?.location || null,
        viewCount: blog.metrics?.viewCount || 0,
        likeCount: blog.metrics?.likeCount || 0,
        commentCount: blog.metrics?.commentCount || 0,
        status: blog.status,
        flags: blog.flags?.length || 0,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      };
    });
    return {
      data: listBlogs,
      Total_Blogs: totalItems,
      currentPage: page,
      pageSize: pageSize,
      totalPages,
    };
  }

  // Get all approved blogs for home page (public access)
  async getAllApprovedBlogs(page?: number, limit?: number, search?: string) {
    try {
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Build query for approved blogs only
      let query: any = { status: 'APPROVED' };

      // Add search functionality if provided
      if (search && search.trim() !== '') {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
          { 'destination.location': { $regex: search, $options: 'i' } },
        ];
      }

      // Get total count for pagination
      const totalBlogs = await this.blogModel.countDocuments(query);
      const totalPages = Math.ceil(totalBlogs / limitNum);

      // Get blogs with pagination and populate author info
      const blogs = await this.blogModel
        .find(query)
        .populate({
          path: 'createdBy',
          populate: {
            path: 'userId',
            select: 'email',
          },
          select: 'fullName userId',
        })
        .select(
          'title summary coverImage location tags status metrics createdAt updatedAt',
        )
        .sort({ updatedAt: -1, createdAt: -1 }) // Show latest first
        .skip(skip)
        .limit(limitNum)
        .exec();

      return {
        status: 'success',
        data: {
          blogs: blogs.map((blog) => ({
            _id: blog._id,
            title: blog.title,
            summary: blog.summary,
            coverImage: blog.coverImage,
            location: blog.destination?.location,
            tags: blog.tags,
            author: {
              name: blog.createdBy?.fullName || 'Unknown',
              email: blog.createdBy?.userId?.email || '',
            },
            metrics: {
              viewCount: blog.metrics?.viewCount || 0,
              likeCount: blog.metrics?.likeCount || 0,
              commentCount: blog.metrics?.commentCount || 0,
            },
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
          })),
          pagination: {
            currentPage: pageNum,
            totalPages: totalPages,
            totalItems: totalBlogs,
            itemsPerPage: limitNum,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1,
          },
        },
      };
    } catch (error) {
      throw new NotFoundException(
        'Error retrieving approved blogs: ' + error.message,
      );
    }
  }

  async updateMetrics(blogId: string, req: Request) {
    const reqUserId = req.user?.['userId'] as string;
    const blog = await this.blogModel.findById(blogId).exec();

    if (!blog) throw new NotFoundException('Blog not found');

    // Đếm lại số lượng like và comment
    const likeCount = blog.likes ? blog.likes.length : 0;
    const commentCount = blog.comments ? blog.comments.length : 0;

    // Xử lý viewCount: chỉ tăng nếu người xem không phải là người tạo blog
    let viewCount = blog.metrics?.viewCount || 0;
    if (reqUserId && blog.createdBy.toString() !== reqUserId) {
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
      createdBy: blog.createdBy,
      summary: blog.summary,
      coverImage: blog.coverImage,
      status: blog.status,
      destination: blog.destination?.location,
      flags: blog.flags || [],
      createdAt: blog.createdAt,
    };
  }

  // update status of blog by id
  async updateStatus(blogId: string, status: 'APPROVED' | 'REJECTED') {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) throw new NotFoundException('Blog not found');

    blog.status = status;
    blog.updatedAt = new Date(); // Cập nhật thời gian sửa đổi
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
    const blog = await this.blogModel
      .findById(blogId)
      .populate({
        path: 'createdBy',
        populate: {
          path: 'userId',
          model: 'Account',
          select: 'role',
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
      throw new BadRequestException('Cannot ban admin or manager author');
    } else if (
      blog.createdBy &&
      blog.createdBy.userId &&
      blog.createdBy.userId.role === 'USER'
    ) {
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
    // Nếu không rơi vào các trường hợp trên
    throw new BadRequestException('Invalid blog author');
  }
  // delete blog by id
  async deleteBlogById(blogId: string) {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) throw new NotFoundException('Blog not found');

    // Xóa ảnh trên Cloudinary nếu có coverImage
    if (blog.coverImage) {
      // Lấy public_id từ URL (giả sử bạn lưu đúng chuẩn Cloudinary)
      const publicId = this.assetsService.getPublicIdFromUrl(blog.coverImage);
      if (publicId) {
        await this.assetsService.deleteImage(publicId);
      }
    }

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
      const user = await this.userInfosModel
        .find({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');
      let uploadResult: import('cloudinary').UploadApiResponse | null = null;
      uploadResult = await this.assetsService.uploadImage(file, {
        public_id: `manager/${userId}/${uuidv4()}`,
        folder: `vie-journey/blogs`,
      });
      const newBlog = new this.blogModel({
        ...createBlogDto,
        createdBy: new Types.ObjectId(user[0]._id), // Lấy userId từ userInfos
        updatedBy: new Types.ObjectId(user[0]._id),
        coverImage: uploadResult?.secure_url || '',
        destination: {
          location: createBlogDto?.location || null,
          placeId: null,
        },
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

  // create a flag for a blog
  async createFlag(blogId: string, reason: string, req: Request) {
    const userId = req.user?.['userId'] as string;
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) throw new NotFoundException('Blog not found');

    // Thêm flag mới vào mảng flags
    blog.flags = blog.flags || [];
    blog.flags.push({
      reason,
      userId: new Types.ObjectId(userId), // lưu lại ai là người flag
      date: new Date(),
    });

    await blog.save();
    return { message: 'Flag added successfully', flags: blog.flags };
  }

  // Start writing a blog with location
  async startBlog(
    location: string,
    userId: string,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');

      // Generate title with format: Location + Guide
      const title = `${location} Guide`;

      let coverImageUrl = '';
      // Handle file upload for cover image if provided
      if (file) {
        const uploadResult = await this.assetsService.uploadImage(file, {
          public_id: `users/${userId}/BLOG_COVERS/${uuidv4()}`,
        });
        coverImageUrl = uploadResult?.secure_url || '';
      }

      const newBlog = new this.blogModel({
        title,
        content: 'Write your content', // Empty content initially
        summary: '',
        tags: [],
        coverImage: coverImageUrl,
        tripId: null,
        destination: {
          location,
          placeId: null,
        },
        createdBy: user._id,
        updatedBy: user._id,
        likes: [],
        status: 'DRAFT', // Default status for user-created blogs
        metrics: {
          likeCount: 0,
          commentCount: 0,
          viewCount: 0,
        },
        flags: [],
        comments: [],
      });

      const createdBlog = await newBlog.save();

      return {
        blogId: createdBlog._id,
        title: createdBlog.title,
        location: createdBlog.destination?.location,
        coverImage: createdBlog.coverImage,
        status: createdBlog.status,
        message: 'Blog draft created successfully. You can now start writing.',
      };
    } catch (error) {
      throw new NotFoundException('Error starting blog: ' + error.message);
    }
  }

  // Get draft blog for editing
  async getDraftBlog(blogId: string, userId: string) {
    try {
      const user = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');

      const blog = await this.blogModel
        .findOne({
          _id: blogId,
          createdBy: user._id,
          status: 'DRAFT',
        })
        .populate('createdBy')
        .exec();

      if (!blog) {
        throw new NotFoundException(
          'Draft blog not found or you do not have permission to edit this blog',
        );
      }

      return {
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        summary: blog.summary,
        tags: blog.tags,
        coverImage: blog.coverImage,
        location: blog.destination?.location,
        status: blog.status,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      };
    } catch (error) {
      throw new NotFoundException(
        'Error retrieving draft blog: ' + error.message,
      );
    }
  }

  // Get published blog for viewing/editing (PENDING, APPROVED, REJECTED)
  async getPublishedBlog(blogId: string, userId: string) {
    try {
      const user = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');

      const blog = await this.blogModel
        .findOne({
          _id: blogId,
          createdBy: user._id,
          status: { $in: ['PENDING', 'APPROVED', 'REJECTED'] }, // Only published/reviewed blogs
        })
        .populate('createdBy')
        .exec();

      if (!blog) {
        throw new NotFoundException(
          'Published blog not found or you do not have permission to view this blog',
        );
      }

      return {
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        summary: blog.summary,
        tags: blog.tags,
        coverImage: blog.coverImage,
        location: blog.destination?.location,
        status: blog.status,
        metrics: {
          viewCount: blog.metrics?.viewCount || 0,
          likeCount: blog.metrics?.likeCount || 0,
          commentCount: blog.metrics?.commentCount || 0,
        },
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        message: `Blog is currently ${blog.status}. You can edit this blog if needed.`,
      };
    } catch (error) {
      throw new NotFoundException(
        'Error retrieving published blog: ' + error.message,
      );
    }
  }

  // update a blog by id
  async updateBlogDraft(
    blogId: string,
    updateData: any,
    userId: string,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');

      const blog = await this.blogModel
        .findOne({
          _id: blogId,
          createdBy: user._id,
          status: 'DRAFT',
        })
        .exec();

      if (!blog) {
        throw new NotFoundException(
          'Draft blog not found or you do not have permission to edit this blog',
        );
      }

      // Handle file upload for cover image
      if (file) {
        // Delete old cover image if exists
        if (blog.coverImage) {
          const publicId = this.assetsService.getPublicIdFromUrl(
            blog.coverImage,
          );
          if (publicId) {
            await this.assetsService.deleteImage(publicId);
          }
        }

        // Upload new cover image
        const uploadResult = await this.assetsService.uploadImage(file, {
          public_id: `users/${userId}/BLOG_COVERS/${blogId}_${uuidv4()}`,
        });
        blog.coverImage = uploadResult?.secure_url || '';
      }

      // Update only provided fields
      if (updateData.title !== undefined) blog.title = updateData.title;
      if (updateData.content !== undefined) blog.content = updateData.content;
      if (updateData.summary !== undefined) blog.summary = updateData.summary;
      if (updateData.tags !== undefined) blog.tags = updateData.tags;

      blog.updatedBy = user._id;
      blog.updatedAt = new Date();

      const updatedBlog = await blog.save();

      return {
        _id: updatedBlog._id,
        title: updatedBlog.title,
        content: updatedBlog.content,
        summary: updatedBlog.summary,
        tags: updatedBlog.tags,
        coverImage: updatedBlog.coverImage,
        location: updatedBlog.destination?.location,
        status: updatedBlog.status,
        updatedAt: updatedBlog.updatedAt,
        message: 'Blog draft updated successfully',
      };
    } catch (error) {
      throw new NotFoundException(
        'Error updating blog draft: ' + error.message,
      );
    }
  }

  // Publish blog (change status from DRAFT to PENDING)
  async publishBlog(blogId: string, userId: string) {
    try {
      const user = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');

      const blog = await this.blogModel
        .findOne({
          _id: blogId,
          createdBy: user._id,
          status: 'DRAFT',
        })
        .exec();

      if (!blog) {
        throw new NotFoundException(
          'Draft blog not found or you do not have permission to publish this blog',
        );
      }

      // Validate required fields before publishing
      if (!blog.title || blog.title.trim().length === 0) {
        throw new BadRequestException('Title is required to publish the blog');
      }
      if (!blog.content || blog.content.trim().length < 20) {
        throw new BadRequestException(
          'Content must be at least 20 characters to publish the blog',
        );
      }

      blog.status = 'PENDING';
      blog.updatedBy = user._id;
      blog.updatedAt = new Date();

      const publishedBlog = await blog.save();

      return {
        blogId: publishedBlog._id,
        title: publishedBlog.title,
        status: publishedBlog.status,
        publishedAt: publishedBlog.updatedAt,
        message:
          'Blog published successfully and is now pending admin approval',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new NotFoundException('Error publishing blog: ' + error.message);
    }
  }

  // Edit published blog - convert back to DRAFT for re-editing
  async editPublishedBlog(
    blogId: string,
    updateData: any,
    userId: string,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');

      const blog = await this.blogModel
        .findOne({
          _id: blogId,
          createdBy: user._id,
          status: { $in: ['PENDING', 'APPROVED', 'REJECTED'] }, // Allow editing published/reviewed blogs
        })
        .exec();

      if (!blog) {
        throw new NotFoundException(
          'Blog not found or you do not have permission to edit this blog',
        );
      }

      // Handle file upload for cover image
      if (file) {
        // Delete old cover image if exists
        if (blog.coverImage) {
          const publicId = this.assetsService.getPublicIdFromUrl(
            blog.coverImage,
          );
          if (publicId) {
            await this.assetsService.deleteImage(publicId);
          }
        }

        // Upload new cover image
        const uploadResult = await this.assetsService.uploadImage(file, {
          public_id: `users/${userId}/BLOG_COVERS/${blogId}_${uuidv4()}`,
        });
        blog.coverImage = uploadResult?.secure_url || '';
      }

      // Update only provided fields
      if (updateData.title !== undefined) blog.title = updateData.title;
      if (updateData.content !== undefined) blog.content = updateData.content;
      if (updateData.summary !== undefined) blog.summary = updateData.summary;
      if (updateData.tags !== undefined) blog.tags = updateData.tags;

      // Convert back to DRAFT status for re-review
      blog.status = 'DRAFT';
      blog.updatedBy = user._id;
      blog.updatedAt = new Date();

      const updatedBlog = await blog.save();

      return {
        _id: updatedBlog._id,
        title: updatedBlog.title,
        content: updatedBlog.content,
        summary: updatedBlog.summary,
        tags: updatedBlog.tags,
        coverImage: updatedBlog.coverImage,
        location: updatedBlog.destination?.location,
        status: updatedBlog.status,
        updatedAt: updatedBlog.updatedAt,
        message:
          'Blog has been edited and converted back to DRAFT status. You can publish it again after review.',
      };
    } catch (error) {
      throw new NotFoundException(
        'Error editing published blog: ' + error.message,
      );
    }
  }

  // Get user's blogs (all statuses)
  async getUserBlogs(userId: string, status?: string) {
    try {
      const user = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!user) throw new NotFoundException('User not found');

      const filter: any = { createdBy: user._id };
      if (status) {
        filter.status = status;
      }

      const blogs = await this.blogModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .exec();

      return {
        blogs: blogs,
        total: blogs.length,
      };
    } catch (error) {
      throw new NotFoundException(
        'Error retrieving user blogs: ' + error.message,
      );
    }
  }
}
