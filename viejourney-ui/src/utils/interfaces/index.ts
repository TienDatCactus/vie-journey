export interface Account {
  _id: string;

  email: string;
  role: "USER" | "ADMIN" | "MANAGER";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
}

export interface Trip {
  _id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budgetRange?: string;
  tripmateRange?: string;
  tripmates: string[];
  description: string;
  visibility: boolean;
}

export interface UserInfo extends Account {
  fullName: string;
  dob: Date | null;
  userId: string;
  phone: string;
  address: string;
  avatar: string;
  lastLoginAt: Date | null;
  flaggedCount: number;
  banReason: string | null;
  bannedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInfoUpdate {
  _id?: string;
  fullName?: string;
  dob?: Date | null;
  phone?: string;
  address?: string;
  avatar?: string;
  lastLoginAt?: Date | null;
  flaggedCount?: number;
  banReason?: string | null;
  bannedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
