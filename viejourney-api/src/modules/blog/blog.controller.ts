import {
  Controller,
  Get,
  Post,
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

// @Roles(Role.Admin)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // list all blogs
  @Get('manager')
  async findAll() {
    return this.blogService.findAll();
  }

  // Lấy chi tiết blog và cập nhật metrics
  @Get(':id')
  async findOne(@Param('id') blogId: string, @Body() userId: string) {
    return this.blogService.updateMetrics(blogId, userId);
  }
  @Get('manager/:id')
  async findOneBlogById(@Param('id') blogId: string) {
    return this.blogService.findOneBlogById(blogId);
  }

  // USER BLOG CREATION WORKFLOW ENDPOINTS

  // Start writing a blog - creates a draft with location and auto-generated title
  @Post('start-blog')
  @UseGuards(JwtAuthGuard)
  async startBlog(
    @Body() startBlogDto: StartBlogDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.startBlog(startBlogDto.location, userId);
  }

  // Get draft blog for editing
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

  // Update draft blog
  @Patch('draft/:id')
  @UseGuards(JwtAuthGuard)
  async updateBlogDraft(
    @Param('id') blogId: string,
    @Body() updateBlogDraftDto: UpdateBlogDraftDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.updateBlogDraft(blogId, updateBlogDraftDto, userId);
  }

  // Publish blog (change from DRAFT to PENDING)
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

  // Get user's blogs
  @Get('my-blogs')
  @UseGuards(JwtAuthGuard)
  async getUserBlogs(
    @Req() req: Request,
    @Body('status') status?: string,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.blogService.getUserBlogs(userId, status);
  }

  // update status of blog by id
  @Post(':id/status')
  async updateStatus(
    @Param('id') blogId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.blogService.updateStatus(blogId, status);
  }

  // clean flags of blog by id
  @Patch(':id/flags')
  async cleanFlags(@Param('id') blogId: string) {
    return this.blogService.cleanFlags(blogId);
  }

  // /blogs/ban-author/:id
  @Post('ban-author/:id')
  async banAuthor(@Param('id') blogId: string, @Body('reason') reason: string) {
    return this.blogService.banAuthor(blogId, reason);
  }

  // delete blog by id
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    return this.blogService.deleteBlogById(blogId);
  }

  // create new blog
  @Post('manager')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only accept pictures!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile('file') file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    return this.blogService.createBlog(createBlogDto, file, userId);
  }

  // create flag for blog
  @Post(':id/flag')
  async createFlag(
    @Param('id') blogId: string,
    @Body('reason') reason: string,
    @Body('userId') userId: string,
  ) {
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Reason is required');
    }
    return this.blogService.createFlag(blogId, reason, userId);
  }
}
