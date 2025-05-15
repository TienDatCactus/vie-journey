import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
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
  async refresh(@Body() req: { refreshToken: string }) {
    return this.authService.refresh(req.refreshToken);
  }
  @Post('logout')
  async logout(@Body() req: { userId: string; refreshToken: string }) {
    return this.authService.logout(req.userId, req.refreshToken);
  }

  @Post('verify')
  async verify(@Body() req: { token: string }) {
    return this.authService.verifyEmail(req.token);
  }
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: { user: Account }) {
    return req.user;
  }
}
