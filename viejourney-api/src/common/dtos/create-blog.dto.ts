import {
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
  Length,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { PlaceData } from '../entities/blog.entity';

export class CreateBlogDto {
  @IsString({ message: 'Title must be a string.' })
  @Length(5, 100, {
    message: 'Title must be between 5 and 100 characters.',
  })
  title: string;

  @IsOptional()
  @IsString({ message: 'Slug must be a string.' })
  @Length(3, 100, {
    message: 'Slug must be between 3 and 100 characters.',
  })
  slug?: string;

  @IsString({ message: 'Content must be a string.' })
  @Length(20, 5000, {
    message: 'Content must be between 20 and 5000 characters.',
  })
  content: string;

  @IsOptional()
  @IsString({ message: 'Summary must be a string.' })
  @MaxLength(300, {
    message: 'Summary must not exceed 300 characters.',
  })
  summary?: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array of strings.' })
  @ArrayMaxSize(10, {
    message: 'A maximum of 10 tags is allowed.',
  })
  @IsString({ each: true, message: 'Each tag must be a string.' })
  tags?: string[];

  @IsOptional()
  @IsString({ message: 'Cover image must be a string URL.' })
  @MaxLength(500, {
    message: 'Cover image URL must not exceed 500 characters.',
  })
  coverImage?: string;

  @IsOptional()
  @IsString({ message: 'Destination must be a string.' })
  destination?: string | null;

  @IsOptional()
  @IsArray({ message: 'Places must be an array.' })
  @ArrayMaxSize(5, {
    message: 'A maximum of 5 places is allowed.',
  })
  places?: PlaceData[];
}
