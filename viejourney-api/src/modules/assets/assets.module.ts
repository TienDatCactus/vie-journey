import { forwardRef, Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset } from 'src/common/entities/asset.entity';
import { AssetSchema } from 'src/infrastructure/database/asset.schema';
import { AuthModule } from '../auth/auth.module';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      {
        name: UserInfos.name,
        schema: UserInfosSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],

  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
