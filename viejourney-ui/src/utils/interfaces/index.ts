export interface Account {
  userId: string;
  email: string;
  role: "USER" | "ADMIN" | "MANAGER";
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  fullName: string;
  avatarUrl: string;
  lastLoginAt?: Date;
  flaggedCount: number; // how many times this user was flagged  ( by blogs )
  banReason?: string;
  bannedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  _id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budgetRange: string;
  tripmateRange: string;
  description: string;
  visibility: boolean;
}
