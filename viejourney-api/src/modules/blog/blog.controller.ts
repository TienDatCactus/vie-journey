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
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateBlogDto } from 'src/common/dtos/create-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dtos/pagination-userlist.dto';

// @Roles(Role.Admin)
// @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get('statistics')
  async getBlogStatistics() {
    return this.blogService.getBlogStatistics();
  }

  // Lấy chi tiết blog và cập nhật metrics
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async findOne(@Param('id') blogId: string, @Req() req: Request) {
    return this.blogService.updateMetrics(blogId, req);
  }
  @Get('manager/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async findOneBlogById(@Param('id') blogId: string) {
    return this.blogService.findBlogById(blogId);
  }

  // update status of blog by id
  @Post(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async updateStatus(
    @Param('id') blogId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.blogService.updateStatus(blogId, status);
  }

  // clean flags of blog by id
  @Patch(':id/flags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async cleanFlags(@Param('id') blogId: string) {
    return this.blogService.cleanFlags(blogId);
  }

  // /blogs/ban-author/:id
  @Post('ban-author/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async banAuthor(@Param('id') blogId: string, @Body('reason') reason: string) {
    return this.blogService.banAuthor(blogId, reason);
  }

  // delete blog by id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async deleteBlog(@Param('id') blogId: string) {
    return this.blogService.deleteBlogById(blogId);
  }

  // create new blog
  @Post('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async createFlag(
    @Param('id') blogId: string,
    @Body('reason') reason: string,
    @Req() req: Request,
  ) {
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Reason is required');
    }
    return this.blogService.createFlag(blogId, reason, req);
  }
}
