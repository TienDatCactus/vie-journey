import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('reports/blogs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getBlogsReport(@Query('views') views?: number) {
    return this.adminService.getBlogsReport(views);
  }

  @Get('reports/comments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getCommentsReport() {
    return this.adminService.getCommentsReport();
  }
}
