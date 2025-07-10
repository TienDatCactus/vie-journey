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

  @Post('/remove-tripmate')
  async removeTripmate(
    @Body() req: { tripId: string; email: string },
    @Req() request: Request,
  ) {
    return await this.tripService.removeTripmate(
      req.tripId,
      req.email,
      request,
    );
  }
  @Post('invite')
  async inviteToTrip(@Body() req: { tripId: string; email: string }) {
    return await this.tripService.inviteToTrip(req.tripId, req.email);
  }
  @Post()
  async create(@Req() req: Request, @Body() createTripDto: CreateTripDto) {
    return await this.tripService.create(createTripDto, req);
  }

  @Post(':id/join')
  async joinTrip(@Param('id') id: string, @Body() req: { token: string }) {
    return await this.tripService.addToTrip(id, req.token);
  }

  @Get('/by-user')
  findByUser(@Req() req: Request) {
    return this.tripService.findByUser(req.user?.['email'] as string);
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
