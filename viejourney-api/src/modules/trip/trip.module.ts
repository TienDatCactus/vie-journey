import { forwardRef, Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { TripGateway } from './trip.gateway';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { TripSchema } from 'src/infrastructure/database/trip.schema';
import { Trip } from 'src/common/entities/trip.entity';
import { PlanStateService } from './plan-state/plan-state.service';
import { TripPlanSchema } from 'src/infrastructure/database/plan.schema';
import { UserModule } from '../userinfo/user.module';
import { UserInfosSchema } from 'src/infrastructure/database/userinfo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      {
        name: 'Plan',
        schema: TripPlanSchema,
      },
      { name: 'User', schema: UserInfosSchema },
    ]),
    JwtModule,
    AccountModule,
    forwardRef(() => AuthModule),
    UserModule,
  ],
  controllers: [TripController],
  providers: [TripService, TripGateway, PlanStateService],
  exports: [TripService],
})
export class TripModule {}
