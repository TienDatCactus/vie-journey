import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('trip')
@UseGuards(JwtAuthGuard)
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  async create(@Req() req: Request, @Body() createTripDto: CreateTripDto) {
    return await this.tripService.create(createTripDto, req);
  }

  @Post(':id/join')
  async joinTrip(@Param('id') id: string, @Body() req: { token: string }) {
    return await this.tripService.addToTrip(id, req.token);
  }

  @Get()
  findAll() {
    return this.tripService.findAll();
  }
  @Post('/:userId')
  findByUser(@Body() req: { userId: string }) {
    return this.tripService.findByUser(req.userId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(+id, updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
