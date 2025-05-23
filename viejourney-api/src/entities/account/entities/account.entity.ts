import { Role } from 'src/entities/auth/entities/role.enum';

export class Account {
  _id: string;
  email: string;
  password: string;
  role: string; // Using Role enum string value
  active: boolean;
}
