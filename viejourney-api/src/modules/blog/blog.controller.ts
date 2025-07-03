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
import { BlogService } from './blog.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateBlogDto } from 'src/common/dtos/create-blog.dto';
import { UpdateBlogDraftDto } from 'src/common/dtos/update-blog-draft.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dtos/pagination-userlist.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('manager')
  async getManagerBlogs(@Query() paginationDto: PaginationDto) {
    return this.blogService.findAll(paginationDto);
  }

  @Get('my-blogs')
  @UseGuards(JwtAuthGuard)
  async getUserBlogs(@Req() req: Request, @Query('status') status?: string) {
    const userId = req.user?.['userId'];
    if (!userId) throw new BadRequestException('User ID not found in request');
    return this.blogService.getUserBlogs(userId, status);
  }

  @Post('start-blog')
  @UseGuards(JwtAuthGuard)
  async startBlog(@Body('location') location: string, @Req() req: Request) {
    const userId = req.user?.['userId'];
    if (!userId) throw new BadRequestException('User ID not found in request');
    return this.blogService.startBlog(location, userId);
  }

  @Get('draft/:id')
  @UseGuards(JwtAuthGuard)
  async getDraftBlog(@Param('id') blogId: string, @Req() req: Request) {
    const userId = req.user?.['userId'];
    if (!userId) throw new BadRequestException('User ID not found in request');
    return this.blogService.getDraftBlog(blogId, userId);
  }

  @Post('publish/:id')
  @UseGuards(JwtAuthGuard)
  async publishBlog(@Param('id') blogId: string, @Req() req: Request) {
    const userId = req.user?.['userId'];
    if (!userId) throw new BadRequestException('User ID not found in request');
    return this.blogService.publishBlog(blogId, userId);
  }

  @Patch('draft/:id')
  @UseGuards(JwtAuthGuard)
  async updateBlogDraft(
    @Param('id') blogId: string,
    @Body() updateBlogDraftDto: UpdateBlogDraftDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) throw new BadRequestException('User ID not found in request');
    return this.blogService.updateBlogDraft(blogId, updateBlogDraftDto, userId);
  }

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
      limits: { fileSize: 5 * 1024 * 1024 },
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

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.findBlogById(id);
  }

  @Get('manager/:id')
  async getManagerBlogById(@Param('id') id: string) {
    return this.blogService.findBlogById(id);
  }
}
