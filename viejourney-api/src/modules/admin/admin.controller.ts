import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserService } from '../userinfo/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAccountDto } from 'src/common/dtos/create-account.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dtos/pagination-userlist.dto';
import { UpdateUserInfoDto } from 'src/common/dtos/update-userinfo.dto';
import { FilterUserDto } from 'src/common/dtos/filter-userinfo.dto';
// @UseGuards(RolesGuard, JwtAuthGuard)
// @Roles(Role.Admin)
@Controller('admin')
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
  async getAllUsers() {
    return this.userService.getAllUser();
  }

  @Get('users/filter')
  async getFilterUsers(@Query() filter: FilterUserDto) {
    return this.userService.getAllUsers(filter);
  }

  @Post('users/paginate')
  async getPaginatedUsers(@Body() paginationDto: PaginationDto) {
    return this.userService.getPaginatedUsers(paginationDto);
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
}
