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
import { UserInfos } from 'src/common/entities/userInfos.entity';
import { Account } from 'src/common/entities/account.entity';
import { Asset } from 'src/common/entities/asset.entity';

@Injectable()
export class TripService {
  constructor(
    @InjectModel('Trip') private readonly tripModel: Model<Trip>,
    @InjectModel('Plan') private readonly planModel: Model<TripPlan>,
    @InjectModel('User') private readonly userModel: Model<UserInfos>,
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    @InjectModel('Asset') private readonly assetModel: Model<Asset>,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
  async removeTripmate(
    tripId: string,
    email: string,
    req: Request,
  ): Promise<Trip> {
    const trip = await this.tripModel.findOne({ _id: tripId });
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.createdBy.toString() !== req.user?.['userId'].toString()) {
      throw new HttpException(
        'Only the trip creator can remove tripmates',
        HttpStatus.FORBIDDEN,
      );
    } else if (email === req.user?.['email']) {
      throw new HttpException(
        'You cannot remove yourself from the trip',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!trip.tripmates.includes(email)) {
      throw new HttpException('User not in trip', HttpStatus.NOT_FOUND);
    }
    trip.tripmates = trip.tripmates.filter((mate) => mate !== email);
    return await trip.save();
  }
  async create(createTripDto: CreateTripDto, req: Request): Promise<Trip> {
    const [startDate, endDate] =
      createTripDto.dates[0] < createTripDto.dates[1]
        ? [createTripDto.dates[0], createTripDto.dates[1]]
        : [createTripDto.dates[1], createTripDto.dates[0]];
    console.log(req.user?.['userId']);
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
            { sub: email, email: email, tripId: saved._id },
            {
              secret: secret,
              expiresIn: '24h',
            },
          );
          const joinLink = `${process.env.FE_URL}/trips/${saved._id}/join?token=${token}`;
          return this.mailService.sendMail({
            to: email,
            subject: 'You are invited to join a trip!',
            template: './invitation',
            context: {
              destination: createTripDto.destination.name,
              joinLink,
            },
          });
        }),
      );
    }
    return saved;
  }
  async validateInvite(tripId: string, token: string) {
    let decodedToken;
    try {
      if (!token) {
        throw new HttpException(
          'No invitation token provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      const secret = process.env.JWT_SECRET || 'secret';
      decodedToken = this.jwtService.verify(token, {
        secret: secret,
      });
      console.log('Decoded token:', decodedToken);
      console.log(tripId);
      if (decodedToken.tripId !== tripId) {
        throw new HttpException(
          'Invalid invitation token for this trip',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Check if token is expired
      if (new Date() > new Date(decodedToken.expiresAt)) {
        throw new HttpException(
          'Invitation token has expired',
          HttpStatus.BAD_REQUEST,
        );
      }
      // 2. Get the trip details
      const trip = await this.tripModel.findById(tripId);
      if (!trip) {
        throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
      }
      const email = decodedToken.email;
      if (!email) {
        throw new HttpException(
          'Email not found in token',
          HttpStatus.BAD_REQUEST,
        );
      }
      const existingUser = await this.userModel.findOne({ email });
      const tripmateExists = trip.tripmates.includes(email);
      return {
        valid: true,
        trip: trip,
        userExists: !!existingUser,
        email: email,
        tripmateExists: tripmateExists ? email : undefined,
      };
    } catch (error) {
      console.error('Error validating invitation token:', error);
      throw new HttpException(
        'Error validating invitation token: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Register the route
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

  async findByUser(email: string) {
    try {
      const trips = await this.tripModel
        .find()
        .where({
          tripmates: { $in: [email] },
        })
        .populate({
          path: 'coverImage',
          model: 'Asset',
          select: 'url',
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
    const trip = this.tripModel
      .findOne({
        _id: id,
      })
      .populate({
        path: 'coverImage',
        model: 'Asset',
        select: 'url',
      })
      .exec();
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
  async inviteToTrip(tripId: string, email: string) {
    try {
      const trip = await this.tripModel.findOne({ _id: tripId });
      if (!trip) {
        throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
      }

      const secret = process.env.JWT_SECRET || 'secret';
      const token = this.jwtService.sign(
        { sub: email, email, tripId: trip._id },
        { secret: secret },
      );

      const joinLink = `${process.env.FE_URL}/trips/${trip._id}/join?token=${token}`;

      // Add await here and detailed logging

      const result = await this.mailService.sendMail({
        to: email,
        subject: 'You are invited to join a trip!',
        template: './invitation',
        context: {
          destination: trip.destination.name,
          joinLink,
        },
      });
      console.log(result);
      if (result) {
        await this.tripModel.updateOne(
          { _id: tripId },
          { $addToSet: { tripmates: email } },
        );
      }
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      // Rethrow with more descriptive message
      throw new HttpException(
        `Failed to send invitation: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findPlanByTripId(tripId: string): Promise<TripPlan | null> {
    return this.planModel
      .findOne({ tripId: new Types.ObjectId(tripId) })
      .exec();
  }
  async updatePlanDates(tripId: string, startDate: Date, endDate: Date) {
    console.log(
      `Updating plan dates for trip ${tripId}: ${startDate} to ${endDate}`,
    );
    const updatedPlan = await this.tripModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(tripId) },
        {
          startDate: startDate,
          endDate: endDate,
        },
        { new: true },
      )
      .exec();
    return updatedPlan;
  }
  async updateTripCoverImage(tripId: string, assetId: string, userId: string) {
    try {
      const asset = await this.assetModel.findOne({
        _id: new Types.ObjectId(assetId),
        userId: new Types.ObjectId(userId),
      });
      if (!asset) {
        throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
      }
      const updatedTrip = await this.tripModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(tripId) },
          { coverImage: asset?._id },
          { new: true },
        )
        .populate({
          path: 'coverImage',
          model: 'Asset',
          select: 'url',
        })
        .exec();
      if (!updatedTrip) {
        throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
      }
      return updatedTrip;
    } catch (error) {
      console.error(error);
    }
  }
}
