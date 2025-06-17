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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request } from 'express';

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
