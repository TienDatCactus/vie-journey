import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Types } from 'mongoose';

import { AssetsService } from '../assets/assets.service';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Account } from 'src/common/entities/account.entity';
import {
  PaginationDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination-userlist.dto';
import { Asset } from 'src/common/entities/asset.entity';
import { FilterUserDto } from 'src/common/dtos/filter-userinfo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private readonly assetsService: AssetsService,
  ) {}
  async getAllUser(
    filter?: FilterUserDto,
    pagination?: PaginationDto,
  ): Promise<{
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
      totalPages?: number;
      currentPage?: number;
      pageSize?: number;
      totalItems: number;
    };
  }> {
    let query = this.userInfosModel.find();

    // Apply filters
    if (filter?.username) {
      query = query.where('fullName', new RegExp(filter.username, 'i'));
    }

    if (filter?.userId) {
      query = query.where('_id', filter.userId);
    }

    const populateQuery: any = {
      path: 'userId',
      model: 'Account',
      select: 'email role status createdAt',
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

    // Get total count for pagination
    const totalItems = await this.userInfosModel.countDocuments(
      query.getQuery(),
    );

    // Apply pagination if provided
    if (pagination?.page && pagination?.pageSize) {
      const skip = (pagination.page - 1) * pagination.pageSize;
      query = query.skip(skip).limit(pagination.pageSize);
    }

    const users = await query.populate(populateQuery).lean().exec();

    const filteredUsers = users
      .filter((user) => user.userId)
      .map((user) => ({
        userId: user._id.toString(),
        accountId: (user.userId as any)._id.toString(),
        email: (user.userId as any).email,
        userName: user.fullName,
        role: (user.userId as any).role,
        status: (user.userId as any).status,
        phone: user.phone || '',
        address: user.address || '',
        createdAt: (user.userId as any).createdAt,
      }));

    const responseData: any = {
      users: filteredUsers,
      totalItems,
    };

    // Add pagination info if pagination is requested
    if (pagination?.page && pagination?.pageSize) {
      const totalPages = Math.ceil(totalItems / pagination.pageSize);
      responseData.totalPages = totalPages;
      responseData.currentPage = pagination.page;
      responseData.pageSize = pagination.pageSize;
    }

    if (filteredUsers.length === 0) {
      return {
        status: 'success',
        message: filter
          ? `No users found matching filters: ${JSON.stringify(filter)}`
          : 'No users found in the system',
        data: responseData,
      };
    }

    return {
      status: 'success',
      message: 'Users retrieved successfully',
      data: responseData,
    };
  }

  async getUserByID(id: string) {
    const user = await this.userInfosModel
      .findOne({
        userId: new Types.ObjectId(id),
      })
      .populate({
        path: 'avatar',
        model: 'Asset',
        select: 'url -_id',
      })
      .exec();
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, 404);
    }
    return {
      ...user.toObject(),
      avatar: user.avatar ? user.avatar.url?.toString() : null,
    };
  }

  async updateUserAvatar(id: string, file: Express.Multer.File) {
    const userInfo = await this.userInfosModel
      .findOne({ userId: new Types.ObjectId(id) })
      .populate('avatar')
      .exec();
    if (!userInfo) {
      throw new NotFoundException(`User info with ID ${id} not found`);
    }
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (userInfo?.avatar?.publicId) {
      await this.assetsService.deleteImage(userInfo.avatar.publicId);
    }
    let uploadResult: import('cloudinary').UploadApiResponse | null = null;
    let assetId;
    uploadResult = await this.assetsService.uploadImage(file, {
      public_id: `users/${userInfo._id}/google-avatar`,
      folder: 'vie-journey/avatars',
    });
    const assetData = {
      userId: new Types.ObjectId(id),
      type: 'AVATAR',
      assetOwner: 'USER',
      subsection: null,
      url: uploadResult?.secure_url,
      publicId: uploadResult?.public_id,
      location: uploadResult.public_id.split('/')[0],
      format: uploadResult.format.toLocaleUpperCase(),
      file_size: `${(uploadResult.bytes / 1024).toFixed(2)} KB`,
      dimensions: `${uploadResult.width} x ${uploadResult.height}`,
    };
    if (userInfo?.avatar?._id) {
      await this.assetModel.updateOne(
        { _id: userInfo.avatar._id },
        { $set: assetData },
      );
    } else {
      const asset = await this.assetModel.create(assetData);
      assetId = asset._id;

      userInfo.avatar = assetId;
      await userInfo.save();
    }
    // Populate lại avatar để lấy thông tin mới nhất
    const updatedUserInfo = await this.userInfosModel
      .findById(userInfo._id)
      .populate('avatar')
      .exec();

    return updatedUserInfo;
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
  async updateUserRole(
    userInfoId: string,
    role: string,
  ): Promise<{
    status: string;
    message: string;
    data: {
      userId: string;
      accountId: string;
      email: string;
      userName: string;
      role: string;
      status: string;
    };
  }> {
    // Find user info
    const userInfo = await this.userInfosModel.findById(userInfoId);
    if (!userInfo) {
      throw new NotFoundException(`User with ID ${userInfoId} not found`);
    }

    // Find related account using userId from userInfo
    const account = await this.accountModel.findById(userInfo.userId);
    if (!account) {
      throw new NotFoundException(`Account not found for user ${userInfoId}`);
    }

    try {
      // Update account role
      account.role = role as any;
      await account.save();

      return {
        status: 'success',
        message: 'User role updated successfully',
        data: {
          userId: userInfo._id.toString(),
          accountId: account._id.toString(),
          email: account.email,
          userName: userInfo.fullName,
          role: account.role,
          status: account.status,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to update user role: ${error.message}`,
      );
    }
  }
}
