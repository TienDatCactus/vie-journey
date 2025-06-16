import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfosSchema } from 'src/common/db/userinfo.schema';
import { UserInfos } from './entities/userInfos.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Account } from '../account/entities/account.entity';
import { AccountSchema } from 'src/common/db/account.schema';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserInfos.name, schema: UserInfosSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    AssetsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserModule],
})
export class UserModule {}
