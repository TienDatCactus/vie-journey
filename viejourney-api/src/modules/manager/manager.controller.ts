import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateHotelDto } from 'src/common/dtos/create-hotel.dto';
import { UpdateHotelDto } from 'src/common/dtos/update-hotel.dto';
import * as XLSX from 'xlsx';
import { HotelService } from '../hotel/hotel.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Manager)
export class ManagerController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('hotel')
  async getHotelList() {
    return this.hotelService.getHotelList();
  }

  @Post('hotel/add')
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    return await this.hotelService.addHotel(createHotelDto);
  }

  @Get('hotel/:id')
  async getHotelDetail(@Param('id') id: string) {
    const hotel = await this.hotelService.getHotelDetail(id);
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  @Delete('hotel/:id')
  async deleteHotel(@Param('id') id: string) {
    return this.hotelService.deleteHotel(id);
  }

  @Patch('hotel/:id')
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelService.updateHotel(id, updateHotelDto);
  }

  @Post('hotel/import')
  @UseInterceptors(FileInterceptor('file'))
  async importHotels(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const hotels: any[] = XLSX.utils.sheet_to_json(sheet);

    await this.hotelService.addListOfHotels(hotels);
    return { count: hotels.length };
  }
}
