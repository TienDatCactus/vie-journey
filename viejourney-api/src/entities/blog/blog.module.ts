import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/common/db/account.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Account } from './entities/blog.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    forwardRef(() => AuthModule), // Use forwardRef to avoid circular dependency
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
