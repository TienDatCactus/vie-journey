export class Account {
  _id: string;
  email: string;
  password: string;
  role: string; // 'USER' | 'ADMIN'
  active: boolean;
}
