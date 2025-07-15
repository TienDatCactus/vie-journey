import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as passport from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'default-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'default-client-secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['email', 'profile'],
      state: true, // Enable state parameter for CSRF protection
    });

    // Set up serialization and deserialization for session support
    passport.serializeUser((user: any, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj: any, done) => {
      done(null, obj);
    });
  }
  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
