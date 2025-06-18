import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AssetsModule } from '../assets/assets.module';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';
import { AccountSchema } from 'src/infrastructure/database/account.schema';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Account } from 'src/common/entities/account.entity';
import { AuthModule } from '../auth/auth.module';

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
