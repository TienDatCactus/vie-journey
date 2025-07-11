import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AuthModule } from '../auth/auth.module';
import { Blog } from 'src/common/entities/blog.entity';
import { BlogSchema } from 'src/infrastructure/database/blog.schema';
import { Account } from 'src/common/entities/account.entity';
import { AccountSchema } from 'src/infrastructure/database/account.schema';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';
import { AssetsModule } from '../assets/assets.module';
import { Like } from 'src/common/entities/like.entity';
import { LikeSchema } from 'src/infrastructure/database/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Account.name, schema: AccountSchema },
      { name: UserInfos.name, schema: UserInfosSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    forwardRef(() => AuthModule),
    AssetsModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
