import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';

import { AssetsService } from '../assets/assets.service';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Account } from 'src/common/entities/account.entity';
import {
  PaginationDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination-userlist.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private readonly assetsService: AssetsService,
  ) {}

  async getAllUser(): Promise<UserInfos[]> {
    return this.userInfosModel.find().populate('userId').exec();
  }

  async getUserByID(id: string) {
    const user = await this.userInfosModel
      .findOne({
        userId: new mongoose.Types.ObjectId(id),
      })
      .populate({
        path: 'avatar',
        model: 'Asset',
        select: 'url -_id',
      })
      .lean()
      .exec();

    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, 404);
    }
    return {
      ...user,
      avatar: user.avatar ? user.avatar?.url?.toString() : null,
    };
  }
  async updateUserAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<UserInfos> {
    const userInfo = await this.userInfosModel.findById(id).exec();
    if (!userInfo) {
      throw new NotFoundException(`User info with ID ${id} not found`);
    }
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const asset = await this.assetsService.uploadImage(file, {
      public_id: `users/${userInfo._id}/AVATAR/google-avatar`,
      folder: 'vie-journey/avatars',
    });
    if (!asset) {
      throw new BadRequestException('Error uploading asset');
    }

    userInfo.avatar = asset?._id;
    await userInfo.save();
    return userInfo;
  }
  async updateUserInfo(id: string, updateUserInfoDto: any): Promise<UserInfos> {
    const updatedUser = await this.userInfosModel
      .findByIdAndUpdate(id, updateUserInfoDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User info with ID ${id} not found`);
    }

    return updatedUser;
  }

  async deleteUserInfo(id: string) {
    const userInfo = await this.userInfosModel.findById(id).exec();
    if (!userInfo) {
      throw new NotFoundException(`User info with ID ${id} not found`);
    }

    await this.accountModel.findByIdAndDelete(userInfo.userId).exec();

    await this.userInfosModel.findByIdAndDelete(id).exec();

    return HttpStatus.OK;
  }

  async getPaginatedUsers(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<UserInfos>> {
    if (!paginationDto.page || !paginationDto.pageSize) {
      throw new BadRequestException('Page and pageSize are required');
    }

    const skip = (paginationDto.page - 1) * paginationDto.pageSize;

    const [users, totalItems] = await Promise.all([
      this.userInfosModel
        .find()
        .populate('userId')
        .skip(skip)
        .limit(paginationDto.pageSize)
        .exec(),
      this.userInfosModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalItems / paginationDto.pageSize);

    return {
      data: users,
      totalPages,
      currentPage: paginationDto.page,
      pageSize: paginationDto.pageSize,
      totalItems,
    };
  }
}
