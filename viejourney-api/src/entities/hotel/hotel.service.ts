import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel } from './entities/hotel.entity';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel('Hotel') private readonly hotelModel: Model<Hotel>
  ) {}

  async findAll () {
    return this.hotelModel.find().exec();
  }

  async findOne(id: string): Promise<Hotel> {
        const hotel = await this.hotelModel.findById(id).exec();
        if (!hotel) {
            throw new NotFoundException(`Hotel with ID ${id} not found`);
        }
        return hotel;
    }

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
        const createdHotel = new this.hotelModel(createHotelDto);
        return await createdHotel.save();
  }

  async delete(id: string): Promise<Hotel> {
    const deletedHotel = await this.hotelModel.findByIdAndDelete(id).exec();
    if (!deletedHotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return deletedHotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
        const existingHotel = await this.hotelModel
            .findByIdAndUpdate(id, updateHotelDto, { new: true })
            .exec();
            
        if (!existingHotel) {
            throw new NotFoundException(`Hotel with ID ${id} not found`);
        }
        
        return existingHotel;
  }

  async importHotels(hotels: Partial<Hotel>[]) {
    await this.hotelModel.insertMany(hotels);
  }
  
}
