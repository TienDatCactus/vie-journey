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
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { UserService } from '../user/user.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { TypeDto } from '../account/dto/Type.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserInfoDto } from '../user/dto/update-userinfo.dto';
import { PaginationDto } from '../user/dto/pagination-userlist.dto';
// @Roles(Role.Admin)
// @UseGuards(RolesGuard, JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) { }

  @Get('assets')
  async getAssetsByType(@Query('type') type: string) {
    return this.adminService.getAssetsByType(type);
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
  @Post('assets/addBanner')
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
  ) {
    return this.adminService.addAssetBanner(file, userId);
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

  @Get('userInfo')
  async getAllUsers() {
    return this.userService.getAllUser();
  }

  @Post('userInfo/paginate')
    async getPaginatedUsers(@Body() paginationDto: PaginationDto) {
        return this.userService.getPaginatedUsers(paginationDto);
  }

  @Get('userInfo/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserByID(id);
  }

  @Patch('userInfo/:id')
    async updateUserInfo(
        @Param('id') id: string,
        @Body() updateUserInfoDto: UpdateUserInfoDto
    ) {
        return this.userService.updateUserInfo(id, updateUserInfoDto);
    }

    @Delete('userInfo/:id')
    async deleteUserInfo(@Param('id') id: string) {
        return this.userService.deleteUserInfo(id);
    }
}
