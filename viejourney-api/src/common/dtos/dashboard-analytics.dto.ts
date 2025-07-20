// src/common/dtos/dashboard-query.dto.ts
import { IsOptional, IsIn } from 'class-validator';

export class DashboardQueryDto {
  @IsOptional()
  @IsIn(['7d', '30d', '90d', '1y'])
  timeRange?: string = '30d';
}

export class DashboardAnalyticsDto {
  // Key Metrics
  totalUsers: number;
  totalTrips: number;
  totalBlogs: number;
  totalInteractions: number;
  usersToday: number;
  tripsToday: number;
  blogsToday: number;
  interactionsToday: number;

  // Chart Data
  userGrowthData: Array<{
    month: string;
    users: number;
    newUsers: number;
  }>;

  contentCreationData: Array<{
    month: string;
    blogs: number;
    trips: number;
  }>;

  engagementData: Array<{
    day: string;
    likes: number;
    comments: number;
    shares: number;
  }>;

  userActivityData: Array<{
    id: number;
    value: number;
    label: string;
    color: string;
  }>;

  contentStatusData: Array<{
    id: number;
    value: number;
    label: string;
    color: string;
  }>;

  topLocationsData: Array<{
    location: string;
    trips: number;
    blogs: number;
  }>;
}
