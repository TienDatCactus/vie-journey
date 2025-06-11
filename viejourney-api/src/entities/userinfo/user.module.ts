import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfosSchema } from 'src/common/db/userinfo.schema';
import { UserInfos } from './entities/userInfos.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Account } from '../account/entities/account.entity';
import { AccountSchema } from 'src/common/db/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserInfos.name, schema: UserInfosSchema },
      { name: Account.name, schema: AccountSchema }
    ]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}