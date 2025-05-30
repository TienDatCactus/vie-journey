import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/common/db/account.schema';
import { Account } from '../account/entities/account.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
 MongooseModule.forFeature([{
  name: Account.name,
  schema: AccountSchema,
 }]),
 forwardRef(() => AuthModule) // Use forwardRef to avoid circular dependency
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
