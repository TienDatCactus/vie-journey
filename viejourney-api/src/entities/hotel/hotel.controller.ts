import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    UploadedFile,
    NotFoundException,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HotelService } from './hotel.service';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';

import * as XLSX from 'xlsx';

@Controller('hotel')
// @Roles(Role.Admin || Role.Manager)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class HotelController {
    constructor(private readonly hotelService: HotelService) { }

    @Get()
    async getHotelList() {
        return this.hotelService.findAll();
    }

    @Get(':id')
    async getHotelDetail(@Param('id') id: string) {
        const hotel = await this.hotelService.findOne(id);
        if (!hotel) {
            throw new NotFoundException(`Hotel with ID ${id} not found`);
        }
        return hotel;
    }

}
