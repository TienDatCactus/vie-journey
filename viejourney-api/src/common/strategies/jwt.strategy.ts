import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../entities/account.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    try {
      const user = await this.accountModel.findById(payload.sub).exec();
      console.log('Validating JWT for user ID:', payload.sub);
      if (!user) {
        console.log('User not found for ID:', payload.sub);
        throw new UnauthorizedException('User not found');
      }
      const result = {
        userId: payload.sub,
        email: payload.email,
        role: user.role, // Pass the role to the request
      };
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error in JWT validation:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
