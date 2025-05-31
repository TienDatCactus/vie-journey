import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());

  // Add session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'vie-journey-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60, // 1 hour
        secure: false,
      },
    }),
  );

  // Initialize Passport with session support
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
