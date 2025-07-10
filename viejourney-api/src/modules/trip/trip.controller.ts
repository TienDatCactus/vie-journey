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
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateTripDto } from 'src/common/dtos/create-trip.dto';
import { UpdateTripDto } from 'src/common/dtos/update-trip.dto';

@Controller('trip')
@UseGuards(JwtAuthGuard)
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get()
  findAllByUser(@Req() req: Request) {
    const userId = req?.user?.['userId'];
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return this.tripService.findByUser(req?.user?.['id']);
  }
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
