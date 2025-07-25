import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { CreateAccountDto } from 'src/common/dtos/create-account.dto';

import {
  DashboardAnalyticsDto,
  DashboardQueryDto,
} from 'src/common/dtos/dashboard-analytics.dto';
import { Account } from 'src/common/entities/account.entity';
import { Asset } from 'src/common/entities/asset.entity';
import { Blog } from 'src/common/entities/blog.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Status } from 'src/common/enums/status.enum';
import { Trip } from 'src/infrastructure/database/trip.schema';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    @InjectModel('Trip') private readonly tripModel: Model<Trip>,
    private readonly assetsService: AssetsService,
  ) {}

  async getUserInfo(id: string) {
    try {
      const userInfo = await this.userInfosModel
        .findOne({ userId: new Types.ObjectId(id) })
        .populate([
          {
            path: 'userId',
            model: 'Account',
            select: 'email role status createdAt',
          },
          {
            path: 'avatar',
            model: 'Asset',
            select: 'url',
          },
        ])
        .exec();
      if (!userInfo) {
        throw new NotFoundException(`UserInfo for Account ID ${id} not found`);
      }

      return {
        ...userInfo.toObject(),
      };
    } catch (error) {
      console.error(error);
    }
  }

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

  async banUser(
    userId: string,
    reason: string,
  ): Promise<{
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
      throw new BadRequestException(
        `Cannot ban user with role '${account.role}'. Only users with role 'USER' can be banned.`,
      );
    }
    if (account.status === Status.banned) {
      throw new BadRequestException(
        `Account is already banned. Ban reason: ${userInfo.banReason}, Banned at: ${userInfo.bannedAt}`,
      );
    }
    try {
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
        bannedAt: userInfo.bannedAt,
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
      throw new BadRequestException(
        `Account is not banned. Current status: ${account.status}`,
      );
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
        bannedAt: userInfo.bannedAt,
      };
    } catch (error) {
      throw new BadRequestException('Failed to unban user: ' + error.message);
    }
  }

  async bulkUpdateUserRoles(
    userIds: string[],
    newRole: string,
  ): Promise<{
    success: Array<{
      userId: string;
      accountId: string;
      email: string;
      userName: string;
      oldRole: string;
      newRole: string;
      status: string;
    }>;
    failed: Array<{
      userId: string;
      reason: string;
    }>;
    summary: {
      totalRequested: number;
      successCount: number;
      failedCount: number;
    };
  }> {
    const validRoles = ['USER', 'ADMIN', 'MANAGER'];
    if (!validRoles.includes(newRole)) {
      throw new BadRequestException(
        `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      );
    }

    const success: Array<{
      userId: string;
      accountId: string;
      email: string;
      userName: string;
      oldRole: string;
      newRole: string;
      status: string;
    }> = [];

    const failed: Array<{
      userId: string;
      reason: string;
    }> = [];

    for (const userId of userIds) {
      try {
        // Find user info by userInfo ID
        const userInfo = await this.userInfosModel.findById(userId);
        if (!userInfo) {
          failed.push({
            userId,
            reason: 'User not found',
          });
          continue;
        }

        // Find account by userId reference
        const account = await this.accountModel.findById(userInfo.userId);
        if (!account) {
          failed.push({
            userId,
            reason: 'Account not found',
          });
          continue;
        }

        // Prevent changing admin roles unless done by another admin
        if (account.role === 'ADMIN' && newRole !== 'ADMIN') {
          failed.push({
            userId,
            reason: 'Cannot change admin role to non-admin role',
          });
          continue;
        }

        // Store old role for response
        const oldRole = account.role;

        // Update account role
        account.role = newRole as any;
        await account.save();

        success.push({
          userId: userInfo._id.toString(),
          accountId: account._id.toString(),
          email: account.email,
          userName: userInfo.fullName || 'Unknown',
          oldRole,
          newRole,
          status: account.status,
        });
      } catch (error) {
        failed.push({
          userId,
          reason: `Error updating user: ${error.message}`,
        });
      }
    }

    return {
      success,
      failed,
      summary: {
        totalRequested: userIds.length,
        successCount: success.length,
        failedCount: failed.length,
      },
    };
  }

  async getDashboardAnalytics(
    query: DashboardQueryDto,
  ): Promise<DashboardAnalyticsDto> {
    const { timeRange } = query;
    if (!timeRange) {
      throw new BadRequestException('Time range is required');
    }
    const endDate = new Date();
    const startDate = this.getStartDate(timeRange, endDate);

    // Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Execute all queries in parallel for better performance
    const [
      // Key Metrics
      totalUsers,
      totalTrips,
      totalBlogs,
      totalInteractions,
      usersToday,
      tripsToday,
      blogsToday,
      interactionsToday,

      // Chart Data
      userGrowthData,
      contentCreationData,
      engagementData,
      userActivityStats,
      contentStatusStats,
      topLocations,
    ] = await Promise.all([
      // Key Metrics Queries
      this.accountModel.countDocuments({ status: { $ne: 'deleted' } }),
      this.tripModel.countDocuments({}),
      this.blogModel.countDocuments({}),
      this.getLikesAndCommentsCount(),

      // Today's Changes
      this.accountModel.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
      this.tripModel.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
      this.blogModel.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
      this.getTodayInteractions(todayStart, todayEnd),

      // Chart Data Queries
      this.getUserGrowthData(startDate, endDate),
      this.getContentCreationData(startDate, endDate),
      this.getEngagementData(),
      this.getUserActivityStats(),
      this.getContentStatusStats(),
      this.getTopLocations(),
    ]);

    return {
      // Key Metrics
      totalUsers,
      totalTrips,
      totalBlogs,
      totalInteractions,
      usersToday,
      tripsToday,
      blogsToday,
      interactionsToday,

      // Chart Data
      userGrowthData,
      contentCreationData,
      engagementData,
      userActivityData: userActivityStats,
      contentStatusData: contentStatusStats,
      topLocationsData: topLocations,
    };
  }

  private getStartDate(timeRange: string, endDate: Date): Date {
    const startDate = new Date(endDate);
    switch (timeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    return startDate;
  }

  private async getLikesAndCommentsCount(): Promise<number> {
    const [likesCount, commentsCount] = await Promise.all([
      this.blogModel.aggregate([
        { $group: { _id: null, total: { $sum: '$metrics.likeCount' } } },
      ]),
      this.blogModel.aggregate([
        { $group: { _id: null, total: { $sum: '$metrics.commentCount' } } },
      ]),
    ]);

    const likes = likesCount[0]?.total || 0;
    const comments = commentsCount[0]?.total || 0;
    return likes + comments;
  }

  private async getTodayInteractions(
    todayStart: Date,
    todayEnd: Date,
  ): Promise<number> {
    // Count likes and comments created today
    const likesCountToday = await this.blogModel.aggregate([
      {
        $match: {
          'likes.createdAt': { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $project: {
          todayLikes: {
            $size: {
              $filter: {
                input: '$likes',
                cond: {
                  $and: [
                    { $gte: ['$$this.createdAt', todayStart] },
                    { $lte: ['$$this.createdAt', todayEnd] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: { _id: null, total: { $sum: '$todayLikes' } },
      },
    ]);

    const commentsCountToday = await this.commentModel.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    return (likesCountToday[0]?.total || 0) + commentsCountToday;
  }

  private async getUserGrowthData(startDate: Date, endDate: Date) {
    const result = await this.accountModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          newUsers: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Get cumulative user count
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let cumulativeUsers = await this.accountModel.countDocuments({
      createdAt: { $lt: startDate },
    });

    return result.map((item) => {
      cumulativeUsers += item.newUsers;
      return {
        month: months[item._id.month - 1],
        users: cumulativeUsers,
        newUsers: item.newUsers,
      };
    });
  }

  private async getContentCreationData(startDate: Date, endDate: Date) {
    const [blogData, tripData] = await Promise.all([
      this.blogModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]),
      this.tripModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]),
    ]);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const result: {
      month: string;
      blogs: number;
      trips: number;
    }[] = [];

    // Create a map for easier lookup
    const blogMap = new Map();
    const tripMap = new Map();

    blogData.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      blogMap.set(key, item.count);
    });

    tripData.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      tripMap.set(key, item.count);
    });

    // Generate result for the last 7 months
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = months[date.getMonth()];

      result.push({
        month: monthName,
        blogs: blogMap.get(key) || 0,
        trips: tripMap.get(key) || 0,
      });
    }

    return result;
  }

  private async getEngagementData() {
    // Get last 7 days engagement data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const result = await this.blogModel.aggregate([
      {
        $match: {
          updatedAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$updatedAt' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          },
          likes: { $sum: '$metrics.likeCount' },
          comments: { $sum: '$metrics.commentCount' },
          shares: { $sum: 0 }, // Assuming shares is not implemented yet
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayData: {
      day: string;
      likes: number;
      comments: number;
      shares: number;
    }[] = [];

    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];

      const data = result.find((r) => r._id.date === dateStr);
      dayData.push({
        day: dayName,
        likes: data?.likes || 0,
        comments: data?.comments || 0,
        shares: data?.shares || 0,
      });
    }

    return dayData;
  }

  private async getUserActivityStats() {
    const totalUsers = await this.accountModel.countDocuments({
      status: { $ne: 'deleted' },
    });

    // Calculate 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activeUsers, newUsers] = await Promise.all([
      this.accountModel.countDocuments({
        status: 'ACTIVE',
        updatedAt: { $gte: thirtyDaysAgo },
      }),
      this.accountModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      }),
    ]);

    const inactiveUsers = totalUsers - activeUsers;

    return [
      { id: 0, value: activeUsers, label: 'Active Users', color: '#10B981' },
      {
        id: 1,
        value: inactiveUsers,
        label: 'Inactive Users',
        color: '#F59E0B',
      },
      { id: 2, value: newUsers, label: 'New Users', color: '#3B82F6' },
    ];
  }

  private async getContentStatusStats() {
    const [approved, draft, pending, rejected] = await Promise.all([
      this.blogModel.countDocuments({ status: 'APPROVED' }),
      this.blogModel.countDocuments({ status: 'DRAFT' }),
      this.blogModel.countDocuments({ status: 'PENDING' }),
      this.blogModel.countDocuments({ status: 'REJECTED' }),
    ]);

    return [
      { id: 0, value: approved, label: 'Approved', color: '#10B981' },
      { id: 1, value: draft, label: 'Draft', color: '#6B7280' },
      { id: 2, value: pending, label: 'Pending', color: '#F59E0B' },
      { id: 3, value: rejected, label: 'Rejected', color: '#EF4444' },
    ];
  }

  private async getTopLocations() {
    const [tripLocations, blogLocations] = await Promise.all([
      this.tripModel.aggregate([
        {
          $group: {
            _id: '$destination.name',
            trips: { $sum: 1 },
          },
        },
        {
          $sort: { trips: -1 },
        },
        {
          $limit: 5,
        },
      ]),
      this.blogModel.aggregate([
        {
          $match: {
            destination: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: '$destination',
            blogs: { $sum: 1 },
          },
        },
        {
          $sort: { blogs: -1 },
        },
        {
          $limit: 5,
        },
      ]),
    ]);

    // Merge trip and blog location data
    const locationMap = new Map();

    tripLocations.forEach((item) => {
      locationMap.set(item._id, {
        location: item._id,
        trips: item.trips,
        blogs: 0,
      });
    });

    blogLocations.forEach((item) => {
      if (locationMap.has(item._id)) {
        locationMap.get(item._id).blogs = item.blogs;
      } else {
        locationMap.set(item._id, {
          location: item._id,
          trips: 0,
          blogs: item.blogs,
        });
      }
    });

    return Array.from(locationMap.values())
      .sort((a, b) => b.trips + b.blogs - (a.trips + a.blogs))
      .slice(0, 5);
  }

  async getRoleBasedCounts(): Promise<{
    userCount: number;
    adminCount: number;
    managerCount: number;
  }> {
    const [userCount, adminCount, managerCount] = await Promise.all([
      this.accountModel.countDocuments({ role: 'USER' }),
      this.accountModel.countDocuments({ role: 'ADMIN' }),
      this.accountModel.countDocuments({ role: 'MANAGER' }),
    ]);

    return {
      userCount,
      adminCount,
      managerCount,
    };
  }
}
