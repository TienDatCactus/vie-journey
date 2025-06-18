import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { AssetsService } from '../assets/assets.service';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Account } from 'src/common/entities/account.entity';
import {
  PaginationDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination-userlist.dto';
import { FilterUserDto } from 'src/common/dtos/filter-userinfo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private readonly assetsService: AssetsService,
  ) { }

  async getAllUser(): Promise<UserInfos[]> {
    return this.userInfosModel.find().populate('userId').exec();
  }

  async getAllUsers(filter?: FilterUserDto): Promise<{
    status: string;
    message: string;
    data: {
      users: Array<{
        userId: string;
        accountId: string;
        email: string;
        userName: string;
        role: string;
        status: string;
        phone: string;
        address: string;
        createdAt: Date;
      }>;
      total: number;
    }
  }> {
    let query = this.userInfosModel.find();

    if (filter?.username) {
      query = query.where('fullName', new RegExp(filter.username, 'i'));
    }

    if (filter?.userId) {
      query = query.where('_id', filter.userId);
    }

    const populateQuery: any = {
      path: 'userId',
      model: 'Account',
      select: 'email role status createdAt'
    };

    if (filter?.role || filter?.status || filter?.email) {
      const match: any = {};
      if (filter.role) {
        match.role = filter.role;
      }
      if (filter.status) {
        match.status = filter.status;
      }
      if (filter.email) {
        match.email = new RegExp(filter.email, 'i');
      }
      populateQuery.match = match;
    }

    const users = await query
      .populate(populateQuery)
      .lean()
      .exec();

    const filteredUsers = users
      .filter(user => user.userId)
      .map(user => ({
        userId: user._id.toString(),
        accountId: (user.userId as any)._id.toString(),
        email: (user.userId as any).email,
        userName: user.fullName,
        role: (user.userId as any).role,
        status: (user.userId as any).status,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: (user.userId as any).createdAt
      }));

    if (filteredUsers.length === 0) {
      return {
        status: 'success',
        message: filter ?
          `No users found matching filters: ${JSON.stringify(filter)}` :
          'No users found in the system',
        data: {
          users: [],
          total: 0
        }
      };
    }

    return {
      status: 'success',
      message: 'Users retrieved successfully',
      data: {
        users: filteredUsers,
        total: filteredUsers.length
      }
    };
  }

  async getUserByID(id: string): Promise<UserInfos> {
    const user = await this.userInfosModel
      .findOne({
        _id: new mongoose.Types.ObjectId(id),
      })
      .exec();
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
