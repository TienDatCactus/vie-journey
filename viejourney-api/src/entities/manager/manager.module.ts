import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { HotelModule } from '../hotel/hotel.module';

@Module({
    imports: [HotelModule],
    controllers: [ManagerController],
})
export class ManagerModule {}