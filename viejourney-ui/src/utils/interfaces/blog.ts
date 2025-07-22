import { PlaceData } from ".";

export interface IQueryParam {
  search: string;
  page: number;
  pageSize: number;
  status: string;
  sort: string;
}
export interface PostData {
  title: string;
  author: string;
  trip: string;
  location: string;
  content: string;
  status: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  coverImage: File | null;
  createdDate: string;
}

export interface IUserAvatar {
  _id: string;
  url: string;
}

export interface IUser {
  _id: string;
  userId: string;
  fullName: string;
  dob: string;
  phone: string;
  address: string;
  avatar: IUserAvatar;
  lastLoginAt: string | null;
  flaggedCount: number;
  banReason: string | null;
  bannedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  data: IBlogPost[];
  Total_Blogs: number;
  currentPage: string;
  pageSize: string;
  totalPages: number;
}
export interface IBlogPost {
  _id: string;
  title: string;
  createdBy: IUser;
  avatarUser: string;
  summary: string;
  destination: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT";
  flags: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogQuery {
  title: string;
  slug: string;
  content: string;
  summary: string;
  tags?: string[];
  destination: string;
  coverImage?: File | null;
}

export interface IBlogRes {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  tags: string[];
  coverImage: string;
  tripId: string;
  createdBy: string;
  updatedBy: string;
  likes: string[];
  status: "APPROVED" | "PENDING" | "REJECTED";
  flags: string[];
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

export interface IFlag {
  reason: string;
  date: string;
}

export interface IBlogDetail {
  _id: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  destination: string;
  tripId: string | null;
  slug: string;
  tags: string[];
  places: PlaceData[];
  createdBy: IUser; // nếu bạn chưa resolve populated user
  updatedBy: IUser | string;
  likes: string[];
  status: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT";
  flags: IFlag[];
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IBlogDraft {
  blogId: string;
  title: string;
  location: string;
  status: string;
  message: string;
}

export interface BlogMetrics {
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface Author {
  name: string;
  email: string;
}
export interface IBlog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  coverImage: string;
  destination: string;
  places: {
    placeId: string;
    displayName: string;
    latitude: number;
    longitude: number;
    editorialSummary?: string;
    types: string[];
    photos: string[];
    googleMapsURI: string;
    showDetails: boolean;
  }[];
  createdBy: {
    _id: string;
    email?: string;
    fullName?: string;
    avatar: {
      _id: string;
      url: string;
    };
    totalBlogs: number;
    likesCount: number;
  };
  updatedBy: string;
  likes: string[];
  status: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT";
  flags: {
    userId: string;
    reason: string;
    date: string;
  }[];
  slug?: string;
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IRelatedBlogs {
  author: {
    name: string;
    email: string;
  };
  coverImage: string;
  createdAt: string;
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  summary: string;
  tags: string[];
  title: string;
  updatedAt: string;
  _id: string;
}
