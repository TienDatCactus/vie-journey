import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() req: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(res, req.email, req.password);
  }

  @Post('register')
  async register(@Body() req: { email: string; password: string }) {
    return this.authService.register(req.email, req.password);
  }
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
  @Get('verify-email')
  async verify(@Query('token') token: string) {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.verifyEmail(token);
  }
  @Post('/resend-verification-email')
  async resendVerificationEmail(
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.resendVerificationEmail(body.email, res);
  }
  @Post('/send-forgot-password-email')
  async sendForgotPasswordEmail(
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.sendForgotPasswordEmail(body.email);
  }
  @Post('/forgot-password')
  async forgotPassword(
    @Body() body: { token: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.forgotPassword(body.token, body.password);
  }
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return { msg: 'Google Authentication' };
  }
  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleAuth(req.user, res);
  }
  @Post('/validate-token')
  async validateToken(
    @Body() body: { token: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.validateAccessToken(body.token);
  }
}
