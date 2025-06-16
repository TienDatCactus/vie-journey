import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { HotelService } from './hotel.service';

import { UpdateHotelDto } from 'src/common/dtos/update-hotel.dto';

@Controller('hotel')
// @Roles(Role.Admin || Role.Manager)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  async getHotelList() {
    return this.hotelService.getHotelList();
  }

  @Get(':id')
  async getHotelDetail(@Param('id') id: string) {
    const hotel = await this.hotelService.getHotelDetail(id);
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  @Delete(':id')
  async deleteHotel(@Param('id') id: string) {
    return this.hotelService.deleteHotel(id);
  }

  @Patch(':id')
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    const hotel = await this.hotelService.updateHotel(id, updateHotelDto);
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }
}
