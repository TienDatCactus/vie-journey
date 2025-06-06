import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class EditProfileDto {
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