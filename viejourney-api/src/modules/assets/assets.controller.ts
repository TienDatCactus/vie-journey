import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Request } from 'express';

@Controller('assets')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.Manager)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('landing')
  async getAllBannersBySubsection() {
    return this.assetsService.fetchAllBannersBySubsection();
  }

  @Get('banner/subsection')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async getSubsection() {
    return this.assetsService.getSubsection();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async getAssetsByType(
    @Query('type') type: string,
    @Query('subsection') subsection?: string,
  ) {
    return this.assetsService.getAssetsByType(type, subsection);
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  async deleteAssetById(@Query('id') id: string) {
    return this.assetsService.deleteAssetById(id);
  }

  @Post('update-asset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
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
    return this.assetsService.updateAssetById(publicId, file);
  }

  // addAsset/banner
  @Post()
  @UseGuards(JwtAuthGuard)
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
  addModularAsset(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body('type') type: string,
    @Body('subsection') subsection?: string,
  ) {
    return this.assetsService.addAssetSystem(file, req, type, subsection);
  }
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Không có file nào được tải lên!');
    }

    try {
      const result = await this.assetsService.uploadImage(file);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      };
    } catch (error) {
      throw new BadRequestException('Error uploading asset ' + error.message);
    }
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadMultipleImages(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file nào được tải lên!');
    }

    try {
      const uploadPromises = files.map((file) =>
        this.assetsService.uploadImage(file),
      );

      const results = await Promise.all(uploadPromises);

      return results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      }));
    } catch (error) {
      throw new BadRequestException('Lỗi khi upload ảnh: ' + error.message);
    }
  }

  @Get('content/by-user')
  @UseGuards(JwtAuthGuard)
  async getAllUserContentAssets(@Req() req: Request) {
    const userId = req.user?.['userId'];
    return await this.assetsService.getAllUserContentAssets(userId);
  }
}
