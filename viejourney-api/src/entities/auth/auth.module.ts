import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AccountSchema } from 'src/common/db/account.schema';
import { AccountModule } from '../account/account.module';
import { Account } from '../account/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, Logger],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
