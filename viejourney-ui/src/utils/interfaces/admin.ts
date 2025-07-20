export interface IAssetType {
  type: "AVATAR" | "BANNER" | "CONTENT";
}

export interface IQueryUpdate {
  publicId: string;
  file: File;
}

export interface IAsset {
  _id: string;
  userId: string;
  type: IAssetType;
  url: string;
  location: string;
  format: string;
  file_size: string;
  dimensions: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export enum ASSET_TYPE {
  AVATAR = "AVATAR",
  BANNER = "BANNER",
  CONTENT = "CONTENT",
}
export interface DashboardAnalyticsResponse {
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
