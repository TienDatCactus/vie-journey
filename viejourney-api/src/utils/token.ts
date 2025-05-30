import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export function createAccessToken(userId: string, email: string) {
  const secret = process.env.JWT_SECRET || 'secret';
  return this.jwtService.sign({ sub: userId, email }, { secret: secret });
}

export function createRefreshToken(userId: string) {
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
export async function validateToken(token: string): Promise<any> {
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
