import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Roles(Role.Admin, Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
}
