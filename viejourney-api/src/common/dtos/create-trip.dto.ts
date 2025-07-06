import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTripDto {
  @IsString({ message: 'Please enter valid destination' })
  @IsNotEmpty({ message: 'Please enter destination' })
  destination: {
    id: string;
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };

  @IsArray({ message: 'Please enter valid date range' })
  @ArrayMinSize(2, { message: 'Please enter valid date range' })
  @ArrayMaxSize(2, { message: 'Please enter valid date range' })
  @IsDate({ each: true, message: 'Please enter valid date range' })
  @Type(() => Date)
  dates: Date[];

  @IsString()
  @IsIn(
    [
      'Solo traveler',
      '2 travelers',
      '3 travelers',
      '4 travelers',
      '5+ travelers',
    ],
    { message: 'Please enter valid traveler range' },
  )
  @IsOptional()
  travelers: string;

  @IsString()
  @IsIn(['Budget ($0 - $500)', 'Mid-range ($500 - $1500)', 'Luxury ($1500+)'], {
    message: 'Please enter valid budget range',
  })
  @IsOptional()
  budget: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @Type(() => Boolean)
  visibility: boolean;

  @IsArray()
  @IsEmail({}, { each: true, message: 'Please enter valid emails' })
  @IsOptional()
  inviteEmails: string[];
}
