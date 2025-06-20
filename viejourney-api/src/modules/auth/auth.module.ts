import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from '../account/account.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../userinfo/user.module';
import { Account } from 'src/common/entities/account.entity';
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { AccountSchema } from 'src/infrastructure/database/account.schema';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { AssetsModule } from '../assets/assets.module';
@Module({
  imports: [
    ConfigModule,
    AssetsModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: UserInfos.name, schema: UserInfosSchema },
    ]),
    UserModule,
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, Logger],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
