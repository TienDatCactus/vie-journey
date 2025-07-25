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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateTripDto } from 'src/common/dtos/create-trip.dto';
import { UpdateTripDto } from 'src/common/dtos/update-trip.dto';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('/remove-tripmate')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async inviteToTrip(
    @Body() req: { tripId: string; email: string },
    @Req() request: Request,
  ) {
    const userId = request.user?.['userId'] as string;
    const trip = await this.tripService.findOne(req.tripId);

    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    const userEmail = request.user?.['email'] as string;
    if (
      trip.createdBy.toString() !== userId &&
      !trip.tripmates.includes(userEmail)
    ) {
      throw new HttpException(
        'You do not have permission to invite others to this trip',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.tripService.inviteToTrip(req.tripId, req.email);
  }

  @Post('validate-invite')
  async validateInvite(
    @Body() req: { tripId: string; token: string },
  ): Promise<{
    valid: boolean;
    trip?: any;
    userExists?: boolean;
    email?: string;
  }> {
    return await this.tripService.validateInvite(req.tripId, req.token);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() createTripDto: CreateTripDto) {
    return await this.tripService.create(createTripDto, req);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async joinTrip(@Param('id') id: string, @Body() req: { token: string }) {
    return await this.tripService.addToTrip(id, req.token);
  }

  @Get('/by-user')
  @UseGuards(JwtAuthGuard)
  findByUser(@Req() req: Request) {
    return this.tripService.findByUser(req.user?.['email'] as string);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(+id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }

  @Get('plan/:id')
  @UseGuards(JwtAuthGuard)
  findPlanByTripId(@Param('id') id: string) {
    return this.tripService.findPlanByTripId(id);
  }

  @Post('update-dates')
  @UseGuards(JwtAuthGuard)
  async patchPlanDates(
    @Body() req: { tripId: string; startDate: Date; endDate: Date },
  ) {
    return this.tripService.updatePlanDates(
      req.tripId,
      req.startDate,
      req.endDate,
    );
  }

  @Post('update-cover-image')
  @UseGuards(JwtAuthGuard)
  async updateTripCoverImage(
    @Body() req: { tripId: string; assetId: string },
    @Req() request: Request,
  ): Promise<any> {
    const userId = request.user?.['userId'] as string;
    return this.tripService.updateTripCoverImage(
      req.tripId,
      req.assetId,
      userId,
    );
  }
}
