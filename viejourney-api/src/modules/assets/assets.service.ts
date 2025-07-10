import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request } from 'express';
import { Model, Types } from 'mongoose';
import { Asset } from 'src/common/entities/asset.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async addAssetSystem(
    file: Express.Multer.File,
    req: Request,
    type: string,
    subsection?: string | null,
  ) {
    const userId = req.user?.['userId'] as string;
    if (!file) {
      throw new BadRequestException('File upload is required');
    }
    // Nếu là asset của hệ thống (cần subsection)
    if (type.toUpperCase() === 'BANNER') {
      if (!subsection) {
        throw new BadRequestException('Subsection is required');
      }
      // Đếm số lượng asset theo subsection (không phân biệt hoa thường)
      const count = await this.assetModel.countDocuments({
        subsection: { $regex: new RegExp(`^${subsection}$`, 'i') },
      });

      if (
        (subsection.toLowerCase() === 'hero' && count >= 1) ||
        (subsection.toLowerCase() === 'intro' && count >= 4) ||
        (subsection.toLowerCase() === 'destination' && count >= 3) ||
        (subsection.toLowerCase() === 'hotel' && count >= 4) ||
        (subsection.toLowerCase() === 'creator' && count >= 3)
      ) {
        throw new BadRequestException(
          `Số lượng asset cho subsection ${subsection} đã vượt quá giới hạn!`,
        );
      }
    }

    // 1. Upload ảnh mới
    const uploadResult = await this.uploadImage(file, {
      public_id: `system/${userId}/${uuidv4()}`,
      folder: `vie-journey/${type.toLocaleLowerCase()}/${subsection ? subsection.toLocaleLowerCase() : ''}`,
    });

    // 2. Tạo mới asset với ảnh đã upload
    const newAsset = new this.assetModel({
      userId: new Types.ObjectId(userId),
      type: type.toLocaleUpperCase(),
      assetOwner: 'SYSTEM',
      subsection: subsection ? subsection.toLocaleUpperCase() : null,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      location: uploadResult.public_id.split('/')[0],
      format: uploadResult.format.toLocaleUpperCase(),
      file_size: `${(uploadResult.bytes / 1024).toFixed(2)} KB`,
      dimensions: `${uploadResult.width} x ${uploadResult.height}`,
    });

    return newAsset.save();
  }

  //updateAsset by id
  async updateAssetById(publicId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload is required');
    }

    // Tìm asset theo id
    const asset = await this.assetModel.findOne({ publicId: publicId }).exec();
    if (!asset) {
      throw new BadRequestException(`Asset with id '${publicId}' not found`);
    }

    // 1. Xóa ảnh cũ trên Cloudinary
    await this.deleteImage(publicId);

    const uploadResult = await this.uploadImage(file, {
      public_id: `${asset.assetOwner.toLocaleLowerCase()}/${asset.userId}/${uuidv4()}`,
      folder: `vie-journey/${asset.type.toLocaleLowerCase()}/${asset?.subsection?.toLocaleLowerCase() || ''}`,
    });
    if (!uploadResult || !uploadResult.secure_url) {
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
    // 3. Cập nhật thông tin asset với ảnh mới từ Cloudinary
    asset.set({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      location: uploadResult.public_id.split('/')[0],
      format: uploadResult.format.toLocaleUpperCase(),
      file_size: `${(uploadResult.bytes / 1024).toFixed(2)} KB`,
      dimensions: `${uploadResult.width} x ${uploadResult.height}`,
    });

    await asset.save(); // Lưu lại thay đổi vào database

    return asset;
  }

  // Delete Asset by ID
  async deleteAssetById(id: string) {
    const asset = await this.assetModel.findById(id).exec();

    if (!asset) {
      throw new BadRequestException(`Asset with id ${id} not found`);
    }

    if (asset.type === 'AVATAR') {
      await this.deleteImage(asset.publicId);

      const updatedAsset = await this.assetModel.findOneAndUpdate(
        { publicId: asset.publicId },
        {
          $set: {
            url: null,
            publicId: null,
            location: null,
            format: null,
            file_size: null,
            dimensions: null,
          },
        },
        { new: true },
      );

      return updatedAsset;
    } else {
      // Xóa ảnh trên Cloudinary (nếu cần)
      await this.deleteImage(asset.publicId);

      // Xóa asset khỏi database
      const deletedAsset = await this.assetModel.findOneAndDelete({
        publicId: asset.publicId,
      });

      return deletedAsset;
    }
  }

  // get subsection
  async getSubsection() {
    const assets = await this.assetModel.find({ type: 'BANNER' });
    // Lấy unique subsection
    const subsection = [...new Set(assets.map((asset) => asset.subsection))];
    return subsection;
  }

  // getAssetsByType
  async getAssetsByType(type: string, subsection?: string) {
    try {
      const filter: any = {};
      if (type) {
        filter.type = { $regex: new RegExp(`^${type}$`, 'i') }; // không phân biệt hoa thường
      }
      if (subsection) {
        filter.subsection = { $regex: new RegExp(`^${subsection}$`, 'i') }; // không phân biệt hoa thường
      }
      const assets = await this.assetModel.find(filter).exec();
      return assets;
    } catch (error) {
      throw new Error(
        `Error fetching assets of type ${type}: ${error.message}`,
      );
    }
  }

  async fetchAllBannersBySubsection() {
    try {
      // Lấy tất cả asset có type là BANNER
      const banners = await this.assetModel.find({ type: 'BANNER' }).exec();

      // Danh sách các subsection cần lấy
      const subsections = ['hero', 'intro', 'destination', 'hotels', 'creator'];

      // Kết quả trả về
      const result: Record<string, any[]> = {};

      subsections.forEach((sub) => {
        // Lọc các banner theo subsection (không phân biệt hoa thường)
        result[sub] = banners
          .filter(
            (b) =>
              b.subsection && b.subsection.toLowerCase() === sub.toLowerCase(),
          )
          .map((b) => ({
            url: b.url,
          }));
      });

      return result;
    } catch (error) {
      throw new BadRequestException(
        `Error fetching landing banner: ${error.message}`,
      );
    }
  }

  async uploadImage(
    file: any,
    options?: { public_id?: string; folder?: string },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
            ],
            ...options, // ghi đè nếu có public_id truyền vào
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Upload failed: No result returned'));
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  getPublicIdFromUrl(url: string): string | null {
    // Ví dụ: https://res.cloudinary.com/.../users/123/IMAGE_BLOG/filename.jpg
    // public_id là phần sau '/upload/' và trước phần mở rộng
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return matches ? matches[1] : null;
  }

  async uploadImageFromUrl(
    imageUrl: string,
    options?: { public_id?: string; folder?: string },
  ): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
        ],
        ...options, // chứa public_id nếu có
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to upload image from URL: ${error.message}`);
    }
  }
}
