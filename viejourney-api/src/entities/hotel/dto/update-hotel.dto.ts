class CoordinateDto {
    latitude?: number;
    longitude?: number;
}

export class UpdateHotelDto {
    name?: string;
    description?: string;
    rating?: number;
    address?: string;
    coordinate?: CoordinateDto;
    images?: string[];
}