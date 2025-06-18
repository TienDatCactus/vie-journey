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
}
