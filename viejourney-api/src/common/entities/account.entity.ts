import { Role } from '../enums/role.enum';
import { Status } from '../enums/status.enum';

export class Account {
  _id: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
