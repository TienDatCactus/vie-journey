import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AssetsService } from '../assets/assets.service';
import { Blog } from 'src/common/entities/blog.entity';
import { Account } from 'src/common/entities/account.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Asset } from 'src/common/entities/asset.entity';
import { CreateAccountDto } from 'src/common/dtos/create-account.dto';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private readonly assetsService: AssetsService,
  ) {}

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

  // Delete Asset by ID
  async deleteAssetById(id: string) {
    const asset = await this.assetModel.findById(id).exec();

    if (!asset) {
      throw new BadRequestException(`Asset with id ${id} not found`);
    }

    if (asset.type === 'AVATAR') {
      await this.assetsService.deleteImage(asset.publicId);

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
      await this.assetsService.deleteImage(asset.publicId);

      // Xóa asset khỏi database
      const deletedAsset = await this.assetModel.findOneAndDelete({
        publicId: asset.publicId,
      });

      return deletedAsset;
    }
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
    await this.assetsService.deleteImage(publicId);

    const uploadResult = await this.assetsService.uploadImage(file, {
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

  // addAsset/system
  async addAssetSystem(
    file: Express.Multer.File,
    userId: string,
    type: string,
    subsection?: string | null,
  ) {
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
    const uploadResult = await this.assetsService.uploadImage(file, {
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

  // getBlogReport
  async getBlogsReport(minViews?: number) {
    const query = minViews ? { views: { $gte: minViews } } : {};
    const totalBlogs = await this.blogModel.countDocuments(query);
    const totalViews = await this.blogModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]);

    return {
      totalBlogs,
      totalViews: totalViews[0]?.total || 0,
    };
  }
  // getCommentsReport
  async getCommentsReport() {
    const totalComments = await this.commentModel.countDocuments();
    const commentsPerBlog = await this.commentModel.aggregate([
      { $group: { _id: '$blog_id', count: { $sum: 1 } } },
    ]);

    return {
      totalComments,
      commentsPerBlog,
    };
  }

  // getAllAccounts
  async getAllAccounts(): Promise<Account[]> {
    return this.accountModel.find({ role: { $ne: 'ADMIN' } }).exec();
  }

  // getAccountById
  async getAccountById(id: string): Promise<Account | null> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new Error(`Account with ID ${id} not found`);
    }
    return account;
  }

  // CREATE ACCOUNT
  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const existUser = await this.accountModel.findOne({
      email: createAccountDto.email,
    });
    if (existUser) {
      throw new Error('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);
    const newAccount = new this.accountModel({
      email: createAccountDto.email,
      password: hashedPassword,
      active: true, // Default to active
    });
    return newAccount.save();
  }

  // deleteAccount
  async deleteAccount(id: string): Promise<Account | null> {
    const account = await this.accountModel.findByIdAndDelete(id).exec();
    if (!account) {
      throw new Error(`Account with ID ${id} not found`);
    }
    return account;
  }

  // update Active Status
  async updateActiveStatus(
    id: string,
    active: boolean,
  ): Promise<Account | undefined> {
    const account = await this.accountModel
      .findByIdAndUpdate(id, {
        status: active ? Status.active : Status.inactive,
      })
      .exec();
    if (!account) {
      throw new Error(`Account with ID ${id} not found`);
    }
    return account;
  }
}
