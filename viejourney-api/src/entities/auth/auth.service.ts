import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AccountService } from 'src/entities/account/account.service';
import { RegistrationTokenSchema } from 'src/common/db/registration_token.schema';
import { Account } from '../account/entities/account.entity';
import { RegistrationToken } from './entities/registration_token.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(RegistrationToken.name)
    private readonly tokenModel: Model<RegistrationToken>,
  ) {}

  async register(email: string, password: string) {
    // Hash password
    const existingUser = await this.accountModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new this.accountModel({
      email,
      password: hashedPassword,
      active: false,
    });

    const token = crypto.randomUUID();
    const createToken = this.tokenModel.create({
      userId: user._id,
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await createToken;
    await user.save();

    // In a real app, you would send an email with the token here

    return {
      message:
        'Registration successful, please check your email to verify account',
    };
  }

  async login(email: string, password: string) {
    const user = await this.accountModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.createAccessToken(user._id, user.email);
    const refreshToken = this.createRefreshToken(user._id);
    const expiresIn = parseInt(process.env.JWT_EXPIRATION || '3600', 10);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await this.tokenModel.updateOne(
      {
        userId: user._id,
      },
      {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    );
    user.active = true;
    await user.save();

    return {
      userId: user._id,
      accessToken,
      expiresAt: expiresAt.toISOString(),
      expiresIn,
    };
  }
  async logout(userId: string) {
    console.log(userId);
    const user = await this.accountModel.findById({
      _id: new Types.ObjectId(userId),
    });
    if (!user) throw new UnauthorizedException('Invalid user');

    await this.tokenModel.deleteMany({ userId: user._id });
    user.active = false;
    await user.save();
    return { message: 'Logged out successfully' };
  }
  async refresh(userId: string) {
    const refreshToken = await this.tokenModel.findOne({ userId });
    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      await this.tokenModel.deleteMany({ userId });
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = this.jwtService.verify(refreshToken.token, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.accountModel.findById(payload.sub);
    if (!user || !this.tokenModel.findOne({ token: refreshToken })) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const accessToken = this.createAccessToken(user._id, user.email);
    return { accessToken };
  }

  private createAccessToken(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }

  private createRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' }, // Refresh token lasts for 7 days
    );
  }

  async verifyEmail(token: string): Promise<any> {
    const tokenRecord = await this.tokenModel.findOne({ token });

    if (!tokenRecord) {
      throw new NotFoundException('Invalid verification token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Verification token has expired');
    }
    if (tokenRecord.confirmedAt) {
      throw new UnauthorizedException('Email already verified');
    }
    tokenRecord.confirmedAt = new Date();
    await tokenRecord.save();
    const user = await this.accountModel.findById(tokenRecord.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.active = true;
    await user.save();

    return { message: 'Email verified successfully' };
  }
}
