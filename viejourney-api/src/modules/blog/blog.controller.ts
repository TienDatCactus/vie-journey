import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateBlogDto } from 'src/common/dtos/create-blog.dto';
import { StartBlogDto } from 'src/common/dtos/start-blog.dto';
import { UpdateBlogDraftDto } from 'src/common/dtos/update-blog-draft.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dtos/pagination-userlist.dto';

// @Roles(Role.Admin)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  // Put specific routes BEFORE parameterized routes
  @Get('manager')
  async getAllBlogs(@Query() paginationDto: PaginationDto) {
    return this.blogService.findAll(paginationDto);
  }

  async getManagerBlogs() {
    return this.blogService.findAll();
  }

  @Get('statistics')
  async getBlogStatistics() {
    return this.blogService.getBlogStatistics();
  }

  // Get all approved blogs for home page (public access)
  @Get('home')
  async getAllApprovedBlogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
      throw new BadRequestException('Invalid pagination parameters. Page must be >= 1, limit must be 1-50');
    }

    return this.blogService.getAllApprovedBlogs(pageNum, limitNum, search);
  }

  // Lấy chi tiết blog và cập nhật metrics
  @Get(':id')
  async findOne(@Param('id') blogId: string, @Body() userId: string) {
    return this.blogService.updateMetrics(blogId, userId);
  }
  }
  @Get('manager/:id')
  async findOneBlogById(@Param('id') blogId: string) {
    return this.blogService.findBlogById(blogId);
  }

  // Get user's blogs - MOVE THIS BEFORE @Get(':id')
  @Get('my-blogs')
  @UseGuards(JwtAuthGuard)
  async getUserBlogs(
    @Req() req: Request,
    @Query('status') status?: string,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.getUserBlogs(userId, status);
  }
  }

  // Start blog creation - MOVE THIS BEFORE @Get(':id')
  @Post('start-blog')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(new BadRequestException('Only image files are allowed for cover image!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async startBlog(
    @Body() startBlogDto: StartBlogDto,
    @UploadedFile() coverImage: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.startBlog(startBlogDto.location, userId, coverImage);
  }

  // Get draft blog - MOVE THIS BEFORE @Get(':id')
  @Get('draft/:id')
  @UseGuards(JwtAuthGuard)
  async getDraftBlog(
    @Param('id') blogId: string,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.getDraftBlog(blogId, userId);
  }

  // Publish blog - MOVE THIS BEFORE @Get(':id')
  @Post('publish/:id')
  @UseGuards(JwtAuthGuard)
  async publishBlog(
    @Param('id') blogId: string,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.publishBlog(blogId, userId);
  }

  // NOW put the parameterized routes AFTER specific routes
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.findOneBlogById(id);
  }

  @Get('manager/:id')
  async getManagerBlogById(@Param('id') id: string) {
    return this.blogService.findOneBlogById(id);
  }

  // Update draft blog
  @Patch('draft/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(new BadRequestException('Only image files are allowed for cover image!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateBlogDraft(
    @Param('id') blogId: string,
    @Body() updateBlogDraftDto: UpdateBlogDraftDto,
    @UploadedFile() coverImage: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.updateBlogDraft(blogId, updateBlogDraftDto, userId, coverImage);
  }

  // Get published blog for viewing/editing
  @Get('published/:id')
  @UseGuards(JwtAuthGuard)
  async getPublishedBlog(
    @Param('id') blogId: string,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.getPublishedBlog(blogId, userId);
  }

  // Edit published blog - convert back to DRAFT
  @Patch('edit/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(new BadRequestException('Only image files are allowed for cover image!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async editPublishedBlog(
    @Param('id') blogId: string,
    @Body() updateBlogDraftDto: UpdateBlogDraftDto,
    @UploadedFile() coverImage: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.editPublishedBlog(blogId, updateBlogDraftDto, userId, coverImage);
  }


  // Other routes...
  @Post(':id/status')
  async updateStatus(
    @Param('id') blogId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.blogService.updateStatus(blogId, status);
  }

  @Patch(':id/flags')
  async cleanFlags(@Param('id') blogId: string) {
    return this.blogService.cleanFlags(blogId);
  }

  @Post('ban-author/:id')
  async banAuthor(@Param('id') blogId: string, @Body('reason') reason: string) {
    return this.blogService.banAuthor(blogId, reason);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlogById(id);
  }

  @Post('manager')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createBlog(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    return this.blogService.createBlog(createBlogDto, file, userId);
  }

  @Post(':id/flag')
  async createFlag(
    @Param('id') blogId: string,
    @Body('reason') reason: string,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    return this.blogService.createFlag(blogId, reason, userId);
  }
}
