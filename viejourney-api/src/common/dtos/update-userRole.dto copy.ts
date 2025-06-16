import { IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER'
}

export class UpdateRoleDto {
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}