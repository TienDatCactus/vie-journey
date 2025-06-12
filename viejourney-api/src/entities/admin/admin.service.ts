import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../blog/entities/blog.entity';
import { Comment } from '../blog/entities/comment.entity';
import { Account } from '../account/entities/account.entity';
import { Model, Types } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import * as bcrypt from 'bcrypt';
import { UserInfos } from '../userinfo/entities/userInfos.entity';
import { Asset } from '../account/entities/asset.entity';
import { TypeDto } from '../account/dto/Type.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from './dto/update-userRole.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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
  async deleteAssetById(id: string) {
    const asset = await this.assetModel.findById(id).exec();

    if (!asset) {
      throw new BadRequestException(`Asset with id ${id} not found`);
    }

    if (asset.type === 'AVATAR') {
      // Xóa ảnh trên Cloudinary (nếu cần)
      await this.cloudinaryService.deleteImage(asset.publicId);

      // Cập nhật lại trường url và publicId về null
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
    } else if (asset.type === 'BANNER') {
      // Xóa ảnh trên Cloudinary (nếu cần)
      await this.cloudinaryService.deleteImage(asset.publicId);

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
      location: uploadResult.public_id.split('/')[0],
      format: uploadResult.format.toLocaleUpperCase(),
      file_size: `${(uploadResult.bytes / 1024).toFixed(2)} KB`,
      dimensions: `${uploadResult.width} x ${uploadResult.height}`,
    });

    await asset.save(); // Lưu lại thay đổi vào database

    return asset;
  }

  // addAsset/banner
  async addAssetBanner(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('File upload is required');
    }

    // 1. Upload ảnh mới
    const uploadResult = await this.cloudinaryService.uploadImage(file, {
      public_id: `users/${userId}/BANNER/${uuidv4()}`,
    });

    // 2. Tạo mới asset với ảnh đã upload
    const newAsset = new this.assetModel({
      userId: new Types.ObjectId(userId),
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      type: 'BANNER',
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
  async updateActiveStatus(id: string, active: boolean): Promise<Account> {
    const account = await this.accountModel.findById(id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    account.status = active ? 'ACTIVE' : 'INACTIVE';
    return account.save();
  }

  //ban useruser
  async banUser(userId: string, reason: string): Promise<{
    userId: string;
    accountId: string;
    role: string;
    email: string;
    userName: string;
    status: string;
    banReason: string;
    flaggedCount: number;
    bannedAt: Date;
  }> {
    const userInfo = await this.userInfosModel.findById(userId);
    if (!userInfo) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const account = await this.accountModel.findById(userInfo.userId);
    if (!account) {
      throw new NotFoundException(`Account not found for user ${userId}`);
    }

    if (account.status === 'BANNED') {
      throw new BadRequestException(`Account is already banned. Ban reason: ${userInfo.banReason}, Banned at: ${userInfo.bannedAt}`);
    }

    try {
      const session = await this.accountModel.startSession();
      let result;

      await session.withTransaction(async () => {
        account.status = 'BANNED';
        await account.save({ session });

        userInfo.banReason = reason;
        userInfo.bannedAt = new Date();
        userInfo.flaggedCount += 1;
        await userInfo.save({ session });

        result = {
          status: "success",
          message: `Banned user '${userInfo.fullName}' successfully`,
          data: {
            userId: userInfo._id.toString(),
            accountId: account._id.toString(),
            userName: userInfo.fullName,
            email: account.email,
            role: account.role,
            status: account.status,
            banReason: userInfo.banReason,
            bannedAt: userInfo.bannedAt,
            flaggedCount: userInfo.flaggedCount
          }
        };
      });

      await session.endSession();
      return result;
    } catch (error) {
      throw new BadRequestException('Failed to ban user: ' + error.message);
    }
  }

  //unban user
  async unbanUser(userId: string): Promise<{
    userId: string;
    accountId: string;
    role: string;
    email: string;
    userName: string;
    status: string;
    banReason: string | null;
    flaggedCount: number;
    bannedAt: Date | null;
  }> {
    const userInfo = await this.userInfosModel.findById(userId);
    if (!userInfo) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const account = await this.accountModel.findById(userInfo.userId);
    if (!account) {
      throw new NotFoundException(`Account not found for user ${userId}`);
    }

    if (account.status !== 'BANNED') {
      throw new BadRequestException(`Account is not banned`);
    }

    try {
      const session = await this.accountModel.startSession();
      let result;

      await session.withTransaction(async () => {
        // Update account status
        account.status = 'ACTIVE';
        await account.save({ session });

        // Clear ban information
        userInfo.banReason = null;
        userInfo.bannedAt = null;
        await userInfo.save({ session });

        result = {
          status: "Success",
          message: `Unban user '${userInfo.fullName}' successfully`,
          data: {
            userId: userInfo._id.toString(),
            accountId: account._id.toString(),
            userName: userInfo.fullName,
            email: account.email,
            role: account.role,
            status: account.status,
            banReason: userInfo.banReason,
            bannedAt: userInfo.bannedAt,
            flaggedCount: userInfo.flaggedCount
          }
        };
      });

      await session.endSession();
      return result;
    } catch (error) {
      throw new BadRequestException('Failed to unban user: ' + error.message);
    }
  }

  // update user role
  async updateUserRole(userInfoId: string, role: UserRole): Promise<{
    userId: string;
    accountId: string;
    email: string;
    userName: string;
    role: string;
    status: string;
  }> {

    const userInfo = await this.userInfosModel.findById(userInfoId);
    if (!userInfo) {
      throw new NotFoundException(`User with ID ${userInfoId} not found`);
    }

    const account = await this.accountModel.findById(userInfo.userId);
    if (!account) {
      throw new NotFoundException(`Account not found for user ${userInfoId}`);
    }

    try {
      const session = await this.accountModel.startSession();
      let result;

      await session.withTransaction(async () => {
        account.role = role;
        await account.save({ session });

        result = {
          status: "Success",
          messsage: "Update user's role succesful",
          data: {
            userId: userInfo._id.toString(),
            accountId: account._id.toString(),
            email: account.email,
            userName: userInfo.fullName,
            role: account.role,
            status: account.status
          }
        };
      });

      await session.endSession();
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to update user role: ${error.message}`);
    }
  }

  // delete user
  async deleteUser(userInfoId: string): Promise<{
    status: string;
    message: string;
    data: {
        userId: string;
        accountId: string;
        email: string;
        userName: string;
    }
}> {

    const userInfo = await this.userInfosModel.findById(userInfoId);
    if (!userInfo) {
        throw new NotFoundException(`User with ID ${userInfoId} not found`);
    }

    const account = await this.accountModel.findById(userInfo.userId);
    if (!account) {
        throw new NotFoundException(`Account not found for user ${userInfoId}`);
    }

    try {
        const session = await this.accountModel.startSession();
        let result;

        await session.withTransaction(async () => {
            await this.accountModel.findByIdAndDelete(account._id).session(session);

            await this.userInfosModel.findByIdAndDelete(userInfoId).session(session);

            result = {
                status: "Success",
                message: `Successfully deleted user '${userInfo.fullName}' and associated account`,
                data: {
                    userId: userInfo._id.toString(),
                    accountId: account._id.toString(),
                    email: account.email,
                    userName: userInfo.fullName
                }
            };
        });

        await session.endSession();
        return result;

    } catch (error) {
        throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
}
}
