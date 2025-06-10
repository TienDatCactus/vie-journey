import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/common/db/account.schema';
import { Account } from '../account/entities/account.entity';
import { AuthModule } from '../auth/auth.module';
import { Blog } from '../blog/entities/blog.entity';
import { Comment } from '../blog/entities/comment.entity';
import { BlogSchema } from 'src/common/db/blog.schema';
import { CommentSchema } from 'src/common/db/comment.schema';
import { UserInfos } from '../account/entities/userInfos.entity';
import { UserInfosSchema } from 'src/common/db/userinfo.schema';
import { AssetSchema } from 'src/common/db/asset.schema';
import { Asset } from '../account/entities/asset.entity';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

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
    CloudinaryModule, // Use forwardRef to avoid circular dependency
    UserModule,
  ],

  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
