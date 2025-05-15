import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './entities/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './entities/auth/auth.module';
import { AccountModule } from './entities/account/account.module';

@Module({
  imports: [
    AdminModule,
    AccountModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      expandVariables: true,
      load: [],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    AuthModule,
    AccountModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
