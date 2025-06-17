import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AssetsModule } from '../assets/assets.module';
import { UserModule } from '../userinfo/user.module';
import { AccountSchema } from 'src/infrastructure/database/account.schema';
import { BlogSchema } from 'src/infrastructure/database/blog.schema';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';
import { CommentSchema } from 'src/infrastructure/database/comment.schema';
import { AssetSchema } from 'src/infrastructure/database/asset.schema';
import { Account } from 'src/common/entities/account.entity';
import { Blog } from 'src/common/entities/blog.entity';
import { Comment } from 'src/common/entities/comment.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Asset } from 'src/common/entities/asset.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: UserInfos.name, schema: UserInfosSchema },
      { name: Asset.name, schema: AssetSchema },
    ]),
    forwardRef(() => AuthModule),
    AssetsModule, // Use forwardRef to avoid circular dependency
    UserModule,
  ],

  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
