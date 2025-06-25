import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AssetsService } from '../assets/assets.service';
import { Asset } from 'src/common/entities/asset.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Account } from 'src/common/entities/account.entity';
import { CreateAccountDto } from 'src/common/dtos/create-account.dto';
import { EditProfileDto } from 'src/common/dtos/editProfile.dto';
import { UpdateAccountDto } from 'src/common/dtos/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private readonly assetsService: AssetsService,
  ) {}
  async activateUser(userId: Types.ObjectId): Promise<void> {
    const user = await this.accountModel.findByIdAndUpdate(
      userId,
      { active: true },
      { new: true },
    );

    if (!user) throw new NotFoundException('User not found');
  }
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    return createdAccount.save();
  }
  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }
  async findOne(id: string) {
    const account = await this.accountModel.findById(id);
    if (!account) {
      throw new HttpException(`Account with id ${id} not found`, 404);
    }
    return {
      _id: account._id,
      email: account.email,
      status: account.status,
      role: account.role,
    };
  }
  async findByEmail(email: string): Promise<Account> {
    const account = await this.accountModel.findOne({ email });
    if (!account) {
      throw new NotFoundException(`Account with email ${email} not found`);
    }
    return account;
  }
  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedAccount) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return updatedAccount;
  }

  async remove(id: string): Promise<Account> {
    const deletedAccount = await this.accountModel.findByIdAndDelete(id).exec();
    if (!deletedAccount) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return deletedAccount;
  }

  async editInfos(
    file: Express.Multer.File,
    editProfile: EditProfileDto,
    userId: string,
  ) {
    try {
      const existingInfo = await this.userInfosModel
        .findOne({ userId: userId })
        .populate('avatar');

      let uploadResult: import('cloudinary').UploadApiResponse | null = null;
      let assetId;

      if (file) {
        if (existingInfo?.avatar?.publicId) {
          await this.assetsService.deleteImage(existingInfo.avatar.publicId);
        }

        uploadResult = await this.assetsService.uploadImage(file, {
          public_id: `users/${userId}/AVATAR/${file.filename}`,
        });

        // Create or update asset
        const assetData = {
          userId: new Types.ObjectId(userId),
          type: 'AVATAR',
          url: uploadResult?.secure_url,
          publicId: uploadResult?.public_id,
        };

        if (existingInfo?.avatar?._id) {
          await this.assetModel.updateOne(
            { _id: existingInfo.avatar._id },
            { $set: assetData },
          );
          assetId = existingInfo.avatar._id;
        } else {
          const asset = await this.assetModel.create(assetData);
          assetId = asset._id;
        }
      }

      // Create or update user info
      if (!existingInfo) {
        // Create new user info
        const userInfoData = {
          ...editProfile,
          userId: new Types.ObjectId(userId),
          ...(assetId ? { avatar: assetId } : {}),
        };

        const userInfo = await this.userInfosModel.create(userInfoData);
        return userInfo;
      } else {
        // Update existing user info
        const updateData = {
          ...editProfile,
          ...(assetId ? { avatar: assetId } : {}),
          updatedAt: new Date(),
        };

        await this.userInfosModel.updateOne(
          { userId: new Types.ObjectId(userId) },
          { $set: updateData },
        );

        return this.userInfosModel
          .findOne({ userId: userId })
          .populate('avatar');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      throw new Error(`Failed to update user info: ${error.message}`);
    }
  }
}
