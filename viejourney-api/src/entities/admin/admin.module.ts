import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BlogSchema } from '../../common/db/blog.schema';
import { CommentSchema } from '../../common/db/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
