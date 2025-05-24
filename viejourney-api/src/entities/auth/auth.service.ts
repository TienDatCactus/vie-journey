import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    private readonly mailService: MailerService,
  ) {}

  async resendVerificationEmail(email: string, res: Response) {
    const user = await this.accountModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.active) {
      throw new ConflictException('User already verified');
    }
    this.sendRegistrationEmail(user);
  }
  async sendEMail(token: string, mail: string) {
    try {
      const link = `${process.env.FE_URL}/auth/verify-email/${token}`;
      const message = `
            <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center;">
                    <h2 style="color: #3f51b5;">Verify Your Email Address</h2>
                    <p style="font-size: 16px; color: #333;">
                        Click the button below to verify your email address and complete your registration.
                    </p>
                    <a href="${link}" style="display: inline-block; margin-top: 15px; padding: 12px 25px; background-color: #3f51b5; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">Verify Email</a>
                </div>
                <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                    If you did not request this, please ignore this email.
                </p>
            </div>
        `;
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
  async sendRegistrationEmail(user: Account) {
    const secret = process.env.JWT_SECRET || 'secret';
    const registrationToken = this.jwtService.sign(
      {
        sub: user._id,
        email: user.email,
        purpose: 'email-verification',
      },
      {
        expiresIn: '24h',
        secret: secret,
      },
    );

    this.sendEMail(registrationToken, user.email);
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

    this.sendRegistrationEmail(user);
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
      // Create a verification token and send it
      const secret = process.env.JWT_SECRET || 'secret';
      this.logger.log(`Using secret for signing: ${secret.substring(0, 5)}...`);

      const verificationToken = this.jwtService.sign(
        {
          sub: user._id,
          email: user.email,
          purpose: 'email-verification',
        },
        {
          expiresIn: '24h',
          secret: secret,
        },
      );

      this.sendEMail(verificationToken, email);
      throw new HttpException(
        'Please verify your email, check your inbox',
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

    return { message: 'Logged out successfully' };
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      // Verify the refresh token
      const secret = process.env.JWT_SECRET || 'secret';
      const payload = this.jwtService.verify(refreshToken, {
        secret: secret,
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
  async verifyEmail(token: string) {
    if (!token) {
      throw new NotFoundException('Invalid verification token');
    }
    try {
      const secret = process.env.JWT_SECRET || 'secret';

      const payload = this.jwtService.verify(token, {
        secret: secret,
      });

      if (payload.purpose !== 'email-verification') {
        this.logger.warn('Token purpose mismatch:', payload.purpose);
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.accountModel.findById(payload.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Activate the user
      user.active = true;
      await user.save();

      return {
        message: 'Email verified successfully',
      };
    } catch (error) {
      this.logger.error('Token verification error:', error);

      if (error.name === 'TokenExpiredError') {
        throw new HttpException(
          'Verification link has expired. Please request a new one.',
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.name === 'JsonWebTokenError') {
        throw new HttpException(
          'Invalid verification token format. Please request a new one.',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Verification failed. Please request a new link.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private createAccessToken(userId: string, email: string) {
    const secret = process.env.JWT_SECRET || 'secret';
    return this.jwtService.sign({ sub: userId, email }, { secret: secret });
  }

  private createRefreshToken(userId: string) {
    const secret = process.env.JWT_SECRET || 'secret';
    return this.jwtService.sign(
      { sub: userId },
      {
        expiresIn: '7d', // Refresh token lasts for 7 days
        secret: secret,
      },
    );
  }

  // Method to validate token and throw correct status codes (useful for middleware)
  async validateToken(token: string): Promise<any> {
    try {
      const secret = process.env.JWT_SECRET || 'secret';
      const payload = this.jwtService.verify(token, {
        secret: secret,
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
