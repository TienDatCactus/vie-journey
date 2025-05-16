import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AccountService } from 'src/entities/account/account.service';
import { Account } from '../account/entities/account.entity';
import { Request, Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    private readonly mailService: MailerService,
  ) {}

  async sendEMail(token: string, mail: string) {
    try {
      const link = `${process.env.FE_URL}/auth/verify-email?token=${token}`;
      const message = `Verify your email address by clicking on the link below: <br> <a href="${link}">Verify Email</a>`;

      await this.mailService.sendMail({
        to: mail,
        subject: `Verify your email address`,
        html: message,
      });
    } catch (error) {
      console.error(`Failed to send verification email to ${mail}:`, error);
      throw new ConflictException(
        'Failed to send verification email. Please try again.',
      );
    }
  }
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
    await user.save();
    const registrationToken = this.createAccessToken(user._id, user.email);
    this.sendEMail(registrationToken, email);

    return {
      message:
        'Registration successful, please check your email to verify account',
    };
  }

  async login(res: Response, email: string, password: string) {
    const user = await this.accountModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.I_AM_A_TEAPOT);
    }
    if (!user.active) {
      throw new HttpException(
        'Please verify your email',
        HttpStatus.BAD_REQUEST,
      );
    }
    const accessToken = this.createAccessToken(user._id, user.email);
    const refreshToken = this.createRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.active = true;
    await user.save();

    return {
      userId: user._id,
      accessToken,
    };
  }
  async logout(req: Request, res: Response) {
    // Clear the refresh token cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 0, // Expires immediately
    });

    // If user ID is in request body or JWT, update user status
    try {
      const token = this.extractTokenFromHeader(req);
      if (token) {
        const payload = this.jwtService.decode(token);
        if (payload && payload.sub) {
          const user = await this.accountModel.findById(payload.sub);
          if (user) {
            user.active = false;
            await user.save();
          }
        }
      }
    } catch (e) {
      // Silently fail - we still want to clear the cookie even if getting the user fails
    }

    return { message: 'Logged out successfully' };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      // Check that the user exists
      const user = await this.accountModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Create a new access token
      const accessToken = this.createAccessToken(user._id, user.email);

      // Create a new refresh token and update the cookie
      const newRefreshToken = this.createRefreshToken(user._id);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { accessToken };
    } catch (error) {
      // If token verification fails, clear the cookie and throw an error
      res.cookie('refreshToken', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 0,
      });

      throw new UnauthorizedException('Invalid refresh token');
    }
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
    if (!token) {
      throw new NotFoundException('Invalid verification token');
    }

    try {
      // Try to verify the token - this will throw if the token is invalid or expired
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.accountModel.findById(payload.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Activate the user
      user.active = true;
      await user.save();

      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException(
          'Verification link has expired. Please request a new one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new UnauthorizedException('Invalid verification token');
    }
  }

  // Method to validate token and throw correct status codes (useful for middleware)
  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.accountModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { userId: payload.sub, email: payload.email };
    } catch (error) {
      // Provide different status codes based on error type
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      } else if (error.name === 'JsonWebTokenError') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
