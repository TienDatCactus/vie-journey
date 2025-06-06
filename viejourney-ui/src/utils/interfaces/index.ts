export interface Account {
  userId: string;
  email: string;
  role: "USER" | "ADMIN" | "MANAGER";
  active: boolean;
}

export interface UserInfo {}
