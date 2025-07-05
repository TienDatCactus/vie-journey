import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, Types } from 'mongoose';
import { CreateTripDto } from 'src/common/dtos/create-trip.dto';
import { UpdateTripDto } from 'src/common/dtos/update-trip.dto';
import { Plan, TripPlan } from 'src/common/entities/plan.entity';
import { Trip } from 'src/common/entities/trip.entity';
import { AccountService } from '../account/account.service';

@Injectable()
export class TripService {
  constructor(
    @InjectModel('Trip') private readonly tripModel: Model<Trip>,
    @InjectModel('Plan') private readonly planModel: Model<TripPlan>,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async create(createTripDto: CreateTripDto, req: Request): Promise<Trip> {
    const [startDate, endDate] =
      createTripDto.dates[0] < createTripDto.dates[1]
        ? [createTripDto.dates[0], createTripDto.dates[1]]
        : [createTripDto.dates[1], createTripDto.dates[0]];
    const newTrip = new this.tripModel({
      title: `Trip to ${createTripDto.destination.name}`,
      destination: createTripDto.destination,
      startDate: startDate,
      endDate: endDate,
      createdBy: req.user?.['userId'] as string,
      budgetRange: createTripDto?.budget,
      tripmateRange: createTripDto.travelers,
      description: createTripDto.description,
      visibility: createTripDto.visibility,
      tripmates: [req.user?.['email'] as string, ...createTripDto.inviteEmails],
    });
    const saved = await newTrip.save();
    if (createTripDto.inviteEmails?.length) {
      await Promise.all(
        createTripDto.inviteEmails.map((email) => {
          const secret = process.env.JWT_SECRET || 'secret';
          const token = this.jwtService.sign(
            { sub: email, email },
            { secret: secret },
          );
          const joinLink = `${process.env.FE_URL}/trip/${saved._id}/join?token=${token}`;
          return this.mailService.sendMail({
            to: email,
            subject: 'You are invited to join a trip!',
            text: `You've been invited to join a trip to ${createTripDto.destination}. Click the link to join: ${joinLink}`,
            html: `<p>You've been invited to join a trip to <strong>${createTripDto.destination}</strong>.</p>
                <p><a href="${joinLink}">Click here to join the trip</a></p>`,
          });
        }),
      );
    }
    return saved;
  }

  async addToTrip(tripId: string, token: string) {
    const trip = await this.tripModel.findOne({ _id: tripId });
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    try {
      const jwt = this.jwtService.verify(token);
      const email = jwt.sub;
      const account = await this.accountService.findByEmail(email as string);
      if (!account) {
        throw new HttpException('User not exists', HttpStatus.UNAUTHORIZED);
      }
      if (trip.tripmates.includes(account.email)) {
        throw new HttpException('User already joined', HttpStatus.NO_CONTENT);
      }
      trip.tripmates.push(account.email);
      await trip.save();
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  async findByUser(userId: string) {
    try {
      const trips = await this.tripModel.find().where({
        userId: userId,
      });
      if (!trips || trips.length === 0) {
        throw new HttpException(
          'No trips found for this user',
          HttpStatus.NOT_FOUND,
        );
      }
      return trips;
    } catch (error) {
      console.error(error);
    }
  }
  findAll() {
    return `This action returns all trip`;
  }

  findOne(id: string) {
    const trip = this.tripModel.findOne({
      _id: id,
    });
    if (!trip)
      throw new HttpException(
        `No trip found with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    return trip;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }
  async updatePlan(
    tripId: string,
    plan: Plan,
    userId?: string,
  ): Promise<TripPlan> {
    return this.planModel
      .findOneAndUpdate(
        { tripId: new Types.ObjectId(tripId) },
        {
          plan,
          lastUpdated: new Date(),
          lastUpdatedBy: userId ? new Types.ObjectId(userId) : undefined,
        },
        { upsert: true, new: true },
      )
      .exec();
  }
  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
