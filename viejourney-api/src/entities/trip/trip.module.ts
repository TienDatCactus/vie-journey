import { forwardRef, Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { Trip } from './entities/trip.entity';
import { TripSchema } from 'src/common/db/trip.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { TripGateway } from './trip.gateway';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    JwtModule,
    AccountModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [TripController],
  providers: [TripService, TripGateway],
  exports: [TripService],
})
export class TripModule {}
