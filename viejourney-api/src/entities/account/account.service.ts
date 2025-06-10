import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './entities/account.entity';
import { UserInfos } from './entities/userInfos.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EditProfileDto } from './dto/editProfile.dto';
import { Asset } from './entities/asset.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private readonly cloudinaryService: CloudinaryService,
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
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return {
      _id: account._id,
      email: account.email,
      active: account.active,
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
    // Tìm userInfo hiện tại (nếu có), và populate avatar
    const existingInfo = await this.userInfosModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('avatar');

    if (file) {
      // Nếu đã có avatar cũ thì xóa trên Cloudinary trước
      if (
        existingInfo &&
        existingInfo.avatar &&
        existingInfo.avatar.publicId !== null
      ) {
        await this.cloudinaryService.deleteImage(existingInfo.avatar.publicId);
      }

      // Upload ảnh mới lên Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImage(file, {
        public_id: `users/${userId}/AVATAR/${file.filename}`,
      });

      if (!existingInfo) {
        // Nếu chưa có userInfo thì tạo mới asset và userInfo
        const asset = await this.assetModel.create({
          userId: new Types.ObjectId(userId),
          type: 'AVATAR',
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          location: uploadResult.public_id.split('/')[0],
          format: uploadResult.format.toLocaleUpperCase(),
          file_size: `${(uploadResult.bytes / 1024).toFixed(2)} KB`,
          dimensions: `${uploadResult.width} x ${uploadResult.height}`,
        });

        const userInfo = await this.userInfosModel.create({
          ...editProfile,
          userId: new Types.ObjectId(userId),
          avatar: asset._id,
        });

        return userInfo;
      }

      // Nếu đã có userInfo → update trường trong editProfile
      await this.userInfosModel.updateOne(
        { userId: new Types.ObjectId(userId) },
        { $set: { ...editProfile, userId: new Types.ObjectId(userId) } },
      );

      // Nếu có avatar liên kết thì cập nhật url & publicId của asset
      if (existingInfo.avatar && existingInfo.avatar._id) {
        const updated = await this.assetModel.findOneAndUpdate(
          { _id: existingInfo.avatar._id },
          {
            $set: {
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id,
              location: uploadResult.public_id.split('/')[0],
              format: uploadResult.format.toLocaleUpperCase(),
              file_size: `${(uploadResult.bytes / 1024).toFixed(2)} KB`,
              dimensions: `${uploadResult.width} x ${uploadResult.height}`,
            },
          },
          { new: true },
        );

        console.log('Updated asset:', updated); // ✅ Log ra để kiểm tra thực tế
      }
    } else {
      // Nếu không có file avatar mới
      if (!existingInfo) {
        // Nếu chưa có userInfo thì tạo mới userInfo (không có avatar)
        const userInfo = await this.userInfosModel.create({
          ...editProfile,
          userId: new Types.ObjectId(userId),
        });
        return userInfo;
      }

      // Nếu đã có userInfo → chỉ update các trường trong editProfile
      await this.userInfosModel.updateOne(
        { userId: new Types.ObjectId(userId) },
        { $set: { ...editProfile, userId: new Types.ObjectId(userId) } },
      );
    }

    // Trả về bản ghi sau khi cập nhật
    return this.userInfosModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('avatar');
  }
}
