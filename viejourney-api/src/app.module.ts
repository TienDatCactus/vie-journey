import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from './modules/admin/admin.module';
import { ManagerModule } from './modules/manager/manager.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { UserModule } from './modules/userinfo/user.module';
import { AccountModule } from './modules/account/account.module';
import { AssetsModule } from './modules/assets/assets.module';
import { TripModule } from './modules/trip/trip.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { CommentModule } from './modules/comment/comment.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      expandVariables: true,
      load: [],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    AdminModule,
    BlogModule,
    ManagerModule,
    HotelModule,
    UserModule,
    AccountModule,
    TripModule,
    CommentModule,
    AssetsModule,
    MailerModule.forRoot({
      transport: {
        service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"VieJourney" <${process.env.MAIL_FROM}>`,
      },
    }),
    AuthModule,
    AccountModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
