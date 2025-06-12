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
    UploadedFile,
    NotFoundException,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from './user.service';
import { UpdateUserInfoDto } from './dto/update-userinfo.dto';

@Controller('user')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('userInfo/edit-profile/:id')
    async updateUserInfo(
      @Param('id') id: string,
      @Body() updateUserInfoDto: UpdateUserInfoDto
    ) {
      return this.userService.updateUserInfo(id, updateUserInfoDto);
    }
}
