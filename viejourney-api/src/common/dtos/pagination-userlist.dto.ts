import {
  IsNumber,
  IsNotEmpty,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1; // Giá trị mặc định

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number = 10; // Giá trị mặc định

  @IsOptional()
  @IsString()
  search?: string;
}

export interface PaginationResponseDto<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}
