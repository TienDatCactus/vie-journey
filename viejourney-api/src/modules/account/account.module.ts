import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthModule } from '../auth/auth.module';
import { AssetsModule } from '../assets/assets.module';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Account } from 'src/common/entities/account.entity';
import { AccountSchema } from 'src/infrastructure/database/account.schema';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';
import { AssetSchema } from 'src/infrastructure/database/asset.schema';
import { Asset } from 'src/common/entities/asset.entity';

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
