import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './entities/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './entities/auth/auth.module';
import { AccountModule } from './entities/account/account.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadModule } from './upload/upload.module';
import { HotelModule } from './entities/hotel/hotel.module';
import { UserModule } from './entities/userinfo/user.module';
import { ManagerModule } from './entities/manager/manager.module';
import { TripModule } from './entities/trip/trip.module';

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
    ManagerModule,
    HotelModule,
    UserModule,
    AccountModule,
    TripModule,
    CloudinaryModule,
    UploadModule,
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
    CloudinaryModule,
    UploadModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
