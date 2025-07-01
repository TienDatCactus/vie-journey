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
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Get('banner/subsection')
  async getSubsection() {
    return this.adminService.getSubsection();
  }

  @Get('assets')
  async getAssetsByType(
    @Query('type') type: string,
    @Query('subsection') subsection?: string,
  ) {
    return this.adminService.getAssetsByType(type, subsection);
  }
  @Delete('assets/delete')
  async deleteAssetById(@Query('id') id: string) {
    return this.adminService.deleteAssetById(id);
  }

  @Post('update-asset')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
      },
    }),
  )
  updateAsset(
    @UploadedFile() file: Express.Multer.File,
    @Body('publicId') publicId: string,
  ) {
    return this.adminService.updateAssetById(publicId, file);
  }

  // addAsset/banner
  @Post('assets')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
      },
    }),
  )
  addAssetBanner(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
    @Body('type') type: string,
    @Body('subsection') subsection: string,
  ) {
    return this.adminService.addAssetSystem(file, userId, type, subsection);
  }

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
      email: query.email
    };

    const pagination = query.page && query.pageSize ? {
      page: parseInt(query.page),
      pageSize: parseInt(query.pageSize)
    } : undefined;

    return this.userService.getAllUser(filter, pagination);
  }

  @Get('users/filter')
  async getFilterUsers(@Query() query: any) {
    const filter = {
      role: query.role,
      status: query.status,
      username: query.username,
      userId: query.userId,
      email: query.email
    };
    
    return this.userService.getAllUser(filter);
  }

  @Post('users/paginate')
  async getPaginatedUsers(@Body() body: any) {
    const filter = body.filter || {};
    const pagination = {
      page: body.page,
      pageSize: body.pageSize
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
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    const validRoles = ['USER', 'ADMIN', 'MANAGER'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
    
    return this.userService.updateUserRole(id, role);
  }

  @Patch('users/:id/ban')
  async banUser(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
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
