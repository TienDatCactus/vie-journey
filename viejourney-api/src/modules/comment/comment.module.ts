import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from 'src/infrastructure/database/comment.schema';
import { Comment } from 'src/common/entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';
import { Blog } from 'src/common/entities/blog.entity';
import { BlogSchema } from 'src/infrastructure/database/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: UserInfos.name, schema: UserInfosSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
