import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateAccountDto } from 'src/common/dtos/create-account.dto';
import { UpdateUserInfoDto } from 'src/common/dtos/update-userinfo.dto';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from '../userinfo/user.service';
import { AdminService } from './admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Get('accounts')
  async getAllAccounts() {
    return this.adminService.getAllAccounts();
  }
  @Post('accounts')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.adminService.createAccount(createAccountDto);
  }
  @Get('accounts/:id')
  async getAccountById(@Param('id') id: string) {
    return this.adminService.getAccountById(id);
  }
  @Delete('accounts/delete/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.adminService.deleteAccount(id);
  }
  @Patch('accounts/updateActive/:id')
  async updateActiveStatus(
    @Param('id') id: string,
    @Body('active') active: boolean,
  ) {
    return this.adminService.updateActiveStatus(id, active);
  }

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
  @Get('users')
  async getAllUsers(@Query() query: any) {
    const filter = {
      role: query.role,
      status: query.status,
      username: query.username,
      userId: query.userId,
      email: query.email,
    };
    const pagination =
      query.page && query.pageSize
        ? {
            page: parseInt(query.page),
            pageSize: parseInt(query.pageSize),
          }
        : undefined;
    const resp = await this.userService.getAllUser(filter, pagination);
    console.log(resp);
    return this.userService.getAllUser(filter, pagination);
  }

  @Get('users/filter')
  async getFilterUsers(@Query() query: any) {
    const filter = {
      role: query.role,
      status: query.status,
      username: query.username,
      userId: query.userId,
      email: query.email,
    };

    return this.userService.getAllUser(filter);
  }

  @Post('users/paginate')
  async getPaginatedUsers(@Body() body: any) {
    const filter = body.filter || {};
    const pagination = {
      page: body.page,
      pageSize: body.pageSize,
    };

    return this.userService.getAllUser(filter, pagination);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserByID(id);
  }

  @Patch('userInfo/:id')
  async updateUserInfo(
    @Param('id') id: string,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    return this.userService.updateUserInfo(id, updateUserInfoDto);
  }

  @Delete('userInfo/:id')
  async deleteUserInfo(@Param('id') id: string) {
    return this.userService.deleteUserInfo(id);
  }

  @Patch('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    const validRoles = ['USER', 'ADMIN', 'MANAGER'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException(
        `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      );
    }

    return this.userService.updateUserRole(id, role);
  }

  @Patch('users/:id/ban')
  async banUser(@Param('id') id: string, @Body('reason') reason: string) {
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Ban reason is required');
    }

    return this.adminService.banUser(id, reason);
  }

  @Patch('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }
}
