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
      throw new NotFoundException('Email not found!');
    }
    if (user.active) {
      throw new ConflictException('User already verified');
    }
    this.sendRegistrationEmail(user);
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
  async sendForgotPasswordEmail(email: string) {
    const user = await this.accountModel.findOne({ email });
    if (!user) {
      throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);
    }
    const secret = process.env.JWT_SECRET || 'secret';
    const forgotPasswordToken = this.jwtService.sign(
      {
        sub: user._id,
        email: user.email,
        purpose: 'forgot-password',
      },
      {
        expiresIn: '15m',
        secret: secret,
      },
    );

    this.sendEMail(forgotPasswordToken, user.email);
  }
  async forgotPassword(token: string, password: string) {
    try {
      const secret = process.env.JWT_SECRET || 'secret';
      const payload = this.jwtService.verify(token, {
        secret: secret,
      });
      if (payload.purpose !== 'forgot-password') {
        this.logger.warn('Token purpose mismatch:', payload.purpose);
        throw new UnauthorizedException('Invalid token type');
      }
      const user = await this.accountModel.findById(payload.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await user.updateOne({ password: await bcrypt.hash(password, 10) });
      this.logger.log(`Password updated for user: ${user.email}`);
      return { message: 'Password updated!' };
    } catch (error) {
      throw new HttpException(
        'Failed to send reset password email',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
  async sendEMail(token: string, mail: string) {
    try {
      const verifyToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret',
      });
      let link = '';
      if (verifyToken.purpose === 'email-verification') {
        link = `${process.env.FE_URL}/auth/verify-email/${token}`;
      } else if (verifyToken.purpose === 'forgot-password') {
        link = `${process.env.FE_URL}/auth/reset-password/${token}`;
      }
      const message = `
           <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
    
    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa;">
        <tr>
            <td align="center" style="padding: 32px 16px;">
                
                <!-- Main Email Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #1976d2; padding: 48px 32px; text-align: center;">
                            <!-- Material Icon -->
                            <div style="width: 72px; height: 72px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#1976d2"/>
                                </svg>
                            </div>
                            
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 500; line-height: 1.334; letter-spacing: 0em;">
                                Verify your email address
                            </h1>
                            <p style="margin: 16px 0 0; color: rgba(255, 255, 255, 0.87); font-size: 16px; font-weight: 400; line-height: 1.5; letter-spacing: 0.00938em;">
                                Complete your account setup
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 32px;">
                            <div style="text-align: left;">
                                <h2 style="margin: 0 0 16px; color: rgba(0, 0, 0, 0.87); font-size: 20px; font-weight: 500; line-height: 1.6; letter-spacing: 0.0075em;">
                                    Welcome! Please verify your email
                                </h2>
                                
                                <p style="margin: 0 0 24px; color: rgba(0, 0, 0, 0.6); font-size: 14px; font-weight: 400; line-height: 1.43; letter-spacing: 0.01071em;">
                                    To complete your account setup and ensure the security of your account, please verify your email address by clicking the button below.
                                </p>
                                
                                <p style="margin: 0 0 32px; color: rgba(0, 0, 0, 0.6); font-size: 14px; font-weight: 400; line-height: 1.43; letter-spacing: 0.01071em;">
                                    This verification link will expire in 24 hours for security purposes.
                                </p>
                                
                                <!-- MUI Button -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td style="border-radius: 4px; background-color: #1976d2; box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);">
                                            <a href="${link}" style="display: inline-block; padding: 8px 22px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; line-height: 1.75; letter-spacing: 0.02857em; text-transform: uppercase; border-radius: 4px; min-width: 64px; text-align: center;">
                                                Verify Email
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Divider -->
                                <div style="margin: 32px 0; height: 1px; background-color: rgba(0, 0, 0, 0.12);"></div>
                                
                                <!-- Alternative Link Section -->
                                <div style="background-color: #f5f5f5; border-radius: 4px; padding: 16px;">
                                    <h3 style="margin: 0 0 8px; color: rgba(0, 0, 0, 0.87); font-size: 14px; font-weight: 500; line-height: 1.57; letter-spacing: 0.00714em;">
                                        Having trouble with the button?
                                    </h3>
                                    <p style="margin: 0 0 8px; color: rgba(0, 0, 0, 0.6); font-size: 12px; font-weight: 400; line-height: 1.66; letter-spacing: 0.03333em;">
                                        Copy and paste this URL into your browser:
                                    </p>
                                    <p style="margin: 0; word-break: break-all; font-size: 12px; line-height: 1.66;">
                                        <a href="${link}" style="color: #1976d2; text-decoration: none; font-weight: 400; clamp: 1; overflow: hidden; text-overflow: ellipsis;">
                                            ${link}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Info Section -->
                    <tr>
                        <td style="padding: 0 32px 32px;">
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; padding: 16px;">
                                <div style="display: flex; align-items: flex-start;">
                                    <div style="margin-right: 12px; margin-top: 2px;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="#f57c00"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p style="margin: 0; color: #e65100; font-size: 14px; font-weight: 400; line-height: 1.43; letter-spacing: 0.01071em;">
                                            <strong style="font-weight: 500;">Security notice:</strong> If you didn't create an account with us, please ignore this email. Your email address will not be added to our system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f5f5; padding: 24px 32px; border-top: 1px solid rgba(0, 0, 0, 0.12);">
                            <div style="text-align: center;">
                                <p style="margin: 0 0 16px; color: rgba(0, 0, 0, 0.6); font-size: 12px; font-weight: 400; line-height: 1.66; letter-spacing: 0.03333em;">
                                    This email was sent because you created an account on our platform.
                                </p>
                                
                                <div style="margin-bottom: 16px;">
                                    <a href="#" style="color: #1976d2; text-decoration: none; font-size: 12px; font-weight: 500; margin: 0 8px; letter-spacing: 0.03333em;">HELP CENTER</a>
                                    <span style="color: rgba(0, 0, 0, 0.38); margin: 0 4px;">•</span>
                                    <a href="#" style="color: #1976d2; text-decoration: none; font-size: 12px; font-weight: 500; margin: 0 8px; letter-spacing: 0.03333em;">CONTACT SUPPORT</a>
                                    <span style="color: rgba(0, 0, 0, 0.38); margin: 0 4px;">•</span>
                                    <a href="#" style="color: #1976d2; text-decoration: none; font-size: 12px; font-weight: 500; margin: 0 8px; letter-spacing: 0.03333em;">PRIVACY POLICY</a>
                                </div>
                                
                                <p style="margin: 0; color: rgba(0, 0, 0, 0.38); font-size: 11px; font-weight: 400; line-height: 1.45; letter-spacing: 0.03636em;">
                                    © 2025 VieJourney. All rights reserved.<br>
                                    FPT University, 101 Trần Đại Nghĩa, Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội, Vietnam
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
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
  async googleAuth(profile: any, res: Response) {
    try {
      console.log(profile);
      const { email } = profile;
      if (!email) {
        throw new HttpException(
          'No email found in Google profile',
          HttpStatus.BAD_REQUEST,
        );
      }
      let user = await this.accountModel.findOne({ email: email }).exec();
      console.log(user);
      if (!user) {
        user = new this.accountModel({
          email: email,
          password: '', // Password is not used for Google auth
          active: true, // Automatically activate user for Google auth
        });
        await user.save();
      }
      const accessToken = this.createAccessToken(user._id, user.email);
      const refreshToken = this.createRefreshToken(user._id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect(
        `${process.env.FE_URL}/auth/oauth-success?` +
          `accessToken=${accessToken}`,
      );
    } catch (error) {
      this.logger.error('Google authentication error:', error);
      throw new HttpException(
        'Google authentication failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async validateAccessToken(accessToken: string) {
    try {
      this.logger.log('Validating access token:', accessToken);
      const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret';
      const payload = this.jwtService.verify(accessToken, {
        secret: secret,
      });
      if (!payload || !payload.sub) {
        this.logger.warn('Invalid access token payload:', payload);
        return null;
      }
      const userId = payload.sub;
      const user = await this.accountModel.findById(userId).exec();
      if (!user) {
        this.logger.warn(`User not found for ID: ${userId}`);
        return null;
      }
      if (!user.active) {
        this.logger.warn(`User with ID ${userId} is not active`);
        return null;
      }
      return {
        userId: user._id,
      };
    } catch (error) {
      this.logger.error('Access token validation error:', error);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token');
      }
      throw new HttpException(
        'Failed to validate access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
