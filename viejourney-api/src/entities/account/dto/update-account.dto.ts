import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto {
  email?: string;
  password?: string;
  role?: 'USER' | 'ADMIN' | 'MANAGER';
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED';
}
