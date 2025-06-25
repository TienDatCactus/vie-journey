import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account } from 'src/common/entities/account.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { AccountSchema } from 'src/infrastructure/database/account.schema';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';
import { AssetsModule } from '../assets/assets.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Asset } from 'src/common/entities/asset.entity';
import { AssetSchema } from 'src/infrastructure/database/asset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserInfos.name, schema: UserInfosSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Asset.name, schema: AssetSchema },
    ]),
    AssetsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserModule],
})
export class UserModule {}
