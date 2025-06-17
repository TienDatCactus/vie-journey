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
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';

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
}
