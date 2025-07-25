import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
const allowedOrigins = ['http://localhost:5173', 'https://vie-journey.site'];
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: function (origin, callback) {
      // Cho phép nếu không có origin (vd: request từ Postman) hoặc nằm trong danh sách
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
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
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('strict routing', true);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
