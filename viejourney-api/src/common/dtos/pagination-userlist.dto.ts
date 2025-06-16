import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class PaginationDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    page: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    pageSize: number;
}

export interface PaginationResponseDto<T> {
    data: T[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
    totalItems: number;
}