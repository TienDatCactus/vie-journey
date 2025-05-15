import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Account } from '../account/entities/account.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: { email: string; password: string }) {
    return this.authService.login(req.email, req.password);
  }

  @Post('register')
  async register(@Body() req: { email: string; password: string }) {
    return this.authService.register(req.email, req.password);
  }
  @Post('refresh')
  async refresh(@Body() req: { userId: string }) {
    return this.authService.refresh(req.userId);
  }
  @Post('logout')
  async logout(@Body() req: { userId: string }) {
    return this.authService.logout(req.userId);
  }

  @Post('verify')
  async verify(@Body() req: { otp: string }) {
    console.log(req);
    return this.authService.verifyEmail(req.otp);
  }
}
