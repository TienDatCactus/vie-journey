import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { AccountSchema } from 'src/common/db/account.schema';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { AuthModule } from '../auth/auth.module';
import { UserInfosSchema } from 'src/common/db/userinfo.schema';
import { UserInfos } from '../userinfo/entities/userInfos.entity';
import { Asset } from './entities/asset.entity';
import { AssetSchema } from 'src/common/db/asset.schema';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: UserInfos.name, schema: UserInfosSchema },
      { name: Asset.name, schema: AssetSchema },
    ]),
    forwardRef(() => AuthModule), // Use forwardRef to avoid circular dependency
    AssetsModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
