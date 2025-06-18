import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateUserInfoDto } from 'src/common/dtos/update-userinfo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
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
}
