import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userInfoSchema } from 'src/common/db/userInfo.shema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'userInfo', schema: userInfoSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}