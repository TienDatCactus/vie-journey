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
} from '@nestjs/common';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { PaginationDto } from 'src/common/dtos/pagination-userlist.dto';
import { CreateBlogDto } from 'src/common/dtos/create-blog.dto';
import { StartBlogDto } from 'src/common/dtos/start-blog.dto';
import { UpdateBlogDraftDto } from 'src/common/dtos/update-blog-draft.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // list all blogs
  @Get('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async getAllBlogs(@Query() paginationDto: PaginationDto) {
    return this.blogService.findAll(paginationDto);
  }

  @Get('home')
  async getAllApprovedBlogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
      throw new BadRequestException(
        'Invalid pagination parameters. Page must be >=1, limit must be 1-50',
      );
    }

    return this.blogService.getAllApprovedBlogs(pageNum, limitNum, search);
  }

  // Get user's blogs - MOVED THIS BEFORE @Get(':id')
  @Get('my-blogs')
  @UseGuards(JwtAuthGuard)
  async getUserBlogs(@Req() req: Request, @Query('status') status?: string) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.getUserBlogs(userId, status);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.findOneBlogById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start-blog')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(
            new BadRequestException('Only image files allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async startBlog(
    @Body() dto: StartBlogDto,
    @UploadedFile() coverImage: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) throw new BadRequestException('User ID not found');
    return this.blogService.startBlog(dto.location, userId, coverImage);
  }

  @UseGuards(JwtAuthGuard)
  @Get('draft/:id')
  async getDraftBlog(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.['userId'];
    return this.blogService.getDraftBlog(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('publish/:id')
  async publishBlog(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.['userId'];
    return this.blogService.publishBlog(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('published/:id')
  async getPublishedBlog(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.['userId'];
    return this.blogService.getPublishedBlog(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('draft/:id')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(
            new BadRequestException('Only image files allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async updateBlogDraft(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDraftDto,
    @UploadedFile() coverImage: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    return this.blogService.updateBlogDraft(id, dto, userId, coverImage);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit/:id')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(
            new BadRequestException('Only image files allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async editPublishedBlog(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDraftDto,
    @UploadedFile() coverImage: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    return this.blogService.editPublishedBlog(id, dto, userId, coverImage);
  }

  // ====================== MANAGER/ADMIN ENDPOINTS ======================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Get('manager/:id')
  async getManagerBlogById(@Param('id') id: string) {
    return this.blogService.findOneBlogById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Post('manager')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(
            new BadRequestException('Only image files allowed!'),
            false,
          );
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.blogService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Patch(':id/flags')
  async cleanFlags(@Param('id') id: string) {
    return this.blogService.cleanFlags(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Post('ban-author/:id')
  async banAuthor(@Param('id') blogId: string, @Body('reason') reason: string) {
    return this.blogService.banAuthor(blogId, reason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlogById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/flag')
  async createFlag(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: Request,
  ) {
    if (!reason?.trim()) {
      throw new BadRequestException('Reason is required');
    }
    return this.blogService.createFlag(id, reason, req);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async updateMetrics(@Param('id') blogId: string, @Req() req: Request) {
    return this.blogService.updateMetrics(blogId, req);
  }
}
