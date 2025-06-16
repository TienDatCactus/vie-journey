import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaginationDto,
  PaginationResponseDto,
} from './dto/pagination-userlist.dto';
import { AssetsService } from '../assets/assets.service';
import { Account } from '../account/entities/account.entity';
import { UserInfos } from './entities/userInfos.entity';

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

  async getUserByID(id: string): Promise<UserInfos> {
    const user = await this.userInfosModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
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

  async deleteUserInfo(id: string): Promise<{ message: string }> {
    const userInfo = await this.userInfosModel.findById(id).exec();
    if (!userInfo) {
      throw new NotFoundException(`User info with ID ${id} not found`);
    }

    await this.accountModel.findByIdAndDelete(userInfo.userId).exec();

    await this.userInfosModel.findByIdAndDelete(id).exec();

    return { message: 'User and related account deleted successfully' };
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
