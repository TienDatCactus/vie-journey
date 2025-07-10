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

    // Check if user role is "USER" - only allow banning regular users
    if (account.role !== 'USER') {
      throw new BadRequestException(`Cannot ban user with role '${account.role}'. Only users with role 'USER' can be banned.`);
    }    if (account.status === Status.banned) {
      throw new BadRequestException(`Account is already banned. Ban reason: ${userInfo.banReason}, Banned at: ${userInfo.bannedAt}`);
    }try {
      // Update account status first
      account.status = Status.banned;
      await account.save();

      // If account update successful, update user info
      userInfo.banReason = reason;
      userInfo.bannedAt = new Date();
      userInfo.flaggedCount += 1;
      await userInfo.save();

      return {
        userId: userInfo._id.toString(),
        accountId: account._id.toString(),
        role: account.role,
        email: account.email,
        userName: userInfo.fullName,
        status: account.status,
        banReason: userInfo.banReason,
        flaggedCount: userInfo.flaggedCount,
        bannedAt: userInfo.bannedAt
      };
    } catch (error) {
      throw new BadRequestException('Failed to ban user: ' + error.message);
    }
  }

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

    if (account.status !== Status.banned) {
      throw new BadRequestException(`Account is not banned. Current status: ${account.status}`);
    }

    try {
      // Update account status to active
      account.status = Status.active;
      await account.save();

      // Clear ban information
      userInfo.banReason = null;
      userInfo.bannedAt = null;
      await userInfo.save();

      return {
        userId: userInfo._id.toString(),
        accountId: account._id.toString(),
        role: account.role,
        email: account.email,
        userName: userInfo.fullName,
        status: account.status,
        banReason: userInfo.banReason,
        flaggedCount: userInfo.flaggedCount,
        bannedAt: userInfo.bannedAt
      };
    } catch (error) {
      throw new BadRequestException('Failed to unban user: ' + error.message);
    }
  }
}
