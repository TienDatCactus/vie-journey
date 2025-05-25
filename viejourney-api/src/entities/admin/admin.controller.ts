import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Account } from '../account/entities/account.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
// @Roles(Role.Admin)
// @UseGuards(RolesGuard, JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

@Get('accounts')
 async getAllAccounts(){
  return this.adminService.getAllAccounts();
 }
 @Post('accounts')
async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.adminService.createAccount(createAccountDto);
  }
@Get('accounts/:id')
  async getAccountById(@Param('id') id: string){
    return this.adminService.getAccountById(id);
  }
@Delete('accounts/delete/:id')
async deleteAccount(@Param('id') id: string) {
    return this.adminService.deleteAccount(id);
  }
}
