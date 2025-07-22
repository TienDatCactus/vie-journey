import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserInfoDto } from 'src/common/dtos/update-userinfo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { Types } from 'mongoose';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('edit-profile')
  async updateUserInfo(
    @Req() req,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.userService.updateUserInfo(userId, updateUserInfoDto);
  }
  @Get()
  async getUserInfo(@Req() req) {
    const userId = req?.user?.['userId'] as string;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }
    return this.userService.getUserByID(userId);
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

  @Get('details')
  async getUserDetails(@Req() req) {
    const userId = req.user?.['userId'] as string;
    const email = req.user?.['email'] as string;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    return this.userService.getUserDetails(userId, email);
  }
}
