
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../blog/entities/blog.entity';
import { Comment } from '../blog/entities/comment.entity';
import { Account } from '../account/entities/account.entity';
import { Model, Types } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import * as bcrypt from 'bcrypt';
import { UserInfos } from '../account/entities/userInfos.entity';
import { Asset } from '../account/entities/asset.entity';
import { TypeDto } from '../account/dto/Type.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // getAssetsByType
  async getAssetsByType(type) {
    try {
      const assets = await this.assetModel
        .find({ type: type })
        .catch((error) => {
          throw new Error(
            `Error fetching assets of type ${type}: ${error.message}`,
          );
        });
      return assets;
    } catch (error) {
      throw new Error(
        `Error fetching assets of type ${type}: ${error.message}`,
      );
    }
  }

  // Delete Asset by ID
  async deleteAssetById(publicId: string) {
    const asset = await this.assetModel.find({ publicId: publicId }).exec();
    if (!asset) {
      throw new BadRequestException(`Asset with ID ${publicId} not found`);
    }
    await this.cloudinaryService.deleteImage(publicId);
    const deletedAsset = await this.assetModel
      .findOneAndDelete({ publicId: publicId })
      .exec();
    if (!deletedAsset) {
      throw new BadRequestException(`Asset with ID ${publicId} not found`);
    }
    return deletedAsset;
  }

  //updateAsset by publicId
  async updateAssetByPublicId(publicId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload is required');
    }

    // Tìm asset theo publicId
    const asset = await this.assetModel.findOne({ publicId: publicId }).exec();
    if (!asset) {
      throw new BadRequestException(
        `Asset with publicId '${publicId}' not found`,
      );
    }

    // 1. Xóa ảnh cũ trên Cloudinary
    await this.cloudinaryService.deleteImage(publicId);

    // 2. Upload ảnh mới
    const uploadResult = await this.cloudinaryService.uploadImage(file, {
      public_id: `users/${asset.userId}/AVATAR/${file.filename}`,
    });
    if (!uploadResult || !uploadResult.secure_url) {
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
    // 3. Cập nhật thông tin asset với ảnh mới từ Cloudinary
    asset.set({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    await asset.save(); // Lưu lại thay đổi vào database

    return asset;
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
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new Error(`Account with ID ${id} not found`);
    }
    account.active = active;
    return account.save();
  }
}
