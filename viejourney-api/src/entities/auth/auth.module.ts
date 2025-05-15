import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Account } from '../account/entities/account.entity';
import { RegistrationTokenSchema } from 'src/common/db/registration_token.schema';
import { AccountSchema } from 'src/common/db/account.schema';
import { RegistrationToken } from './entities/registration_token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: RegistrationToken.name, schema: RegistrationTokenSchema },
    ]),
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
