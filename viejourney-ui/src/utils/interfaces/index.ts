export interface User extends Account {
  status: string;
  fullName: string;
  avatarUrl: string;
  lastLoginAt?: Date;
  flaggedCount: number;
  banReason?: string;
  bannedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  userId: string;
  email: string;
  role: "USER" | "ADMIN" | "MANAGER";
  active: boolean;
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
