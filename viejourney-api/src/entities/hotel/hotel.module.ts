import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelSchema } from 'src/common/db/hotel.schema';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { Hotel } from './entities/hotel.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
})
export class HotelModule {}