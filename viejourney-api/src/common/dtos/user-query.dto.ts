import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED',
    DELETED = 'DELETED'
}

export class UserQueryDto {
    // Filter options
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    email?: string;

    // Pagination options
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageSize?: number;
}
