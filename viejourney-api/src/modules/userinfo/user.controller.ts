import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserInfoDto } from 'src/common/dtos/update-userinfo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserService } from './user.service';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('edit-profile/:id')
  async updateUserInfo(
    @Param('id') id: string,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    return this.userService.updateUserInfo(id, updateUserInfoDto);
  }
  @Get(':id')
  async getUserInfo(@Param('id') id: string) {
    return this.userService.getUserByID(id);
  }
  @Post('edit-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: string,
  ) {
    return this.userService.updateUserAvatar(id, file);
  }
}
