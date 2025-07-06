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
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAccountDto } from 'src/common/dtos/update-account.dto';
import { CreateAccountDto } from 'src/common/dtos/create-account.dto';
import { EditProfileDto } from 'src/common/dtos/editProfile.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User, Role.Manager)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('edit-profile')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only accept pictures!'), false);
        }
        cb(null, true);
      },
    }),
  )
  editProfile(
    @Body() editProfileDto: EditProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    return this.accountService.editInfos(file, editProfileDto, userId);
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }

  @Post('profile')
  getProfile(@Body() req: { userId: string }) {
    return this.accountService.findOne(req.userId);
  }
}
