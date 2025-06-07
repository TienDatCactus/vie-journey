import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HotelService } from '../hotel/hotel.service';
import { CreateHotelDto } from '../hotel/dto/create-hotel.dto';
import { UpdateHotelDto } from '../hotel/dto/update-hotel.dto';
import * as XLSX from 'xlsx';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Manager)
export class ManagerController {
    constructor(private readonly hotelService: HotelService) {}

    @Get('hotels')
    async getHotelList() {
        return this.hotelService.findAll();
    }

    @Post('hotels')
    async createHotel(@Body() createHotelDto: CreateHotelDto) {
        return await this.hotelService.create(createHotelDto);
    }

    @Get('hotels/:id')
    async getHotelDetail(@Param('id') id: string) {
        const hotel = await this.hotelService.findOne(id);
        if (!hotel) {
            throw new NotFoundException(`Hotel with ID ${id} not found`);
        }
        return hotel;
    }

    @Delete('hotels/:id')
    async deleteHotel(@Param('id') id: string) {
        return this.hotelService.delete(id);
    }

    @Patch('hotels/:id')
    async updateHotel(
        @Param('id') id: string,
        @Body() updateHotelDto: UpdateHotelDto
    ) {
        return this.hotelService.update(id, updateHotelDto);
    }

    @Post('hotels/import')
    @UseInterceptors(FileInterceptor('file'))
    async importHotels(@UploadedFile() file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const hotels: any[] = XLSX.utils.sheet_to_json(sheet);
        
        await this.hotelService.importHotels(hotels);
        return { message: 'Import successfully', count: hotels.length };
    }
}