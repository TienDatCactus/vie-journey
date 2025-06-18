import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Role } from '../enums/role.enum';
import { Status } from '../enums/status.enum';

export class FilterUserDto {
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    email?: string;
}