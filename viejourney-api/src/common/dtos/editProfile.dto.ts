import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import mongoose from 'mongoose';

export class EditProfileDto {
  @IsNotEmpty()
  userId: mongoose.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDate()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
