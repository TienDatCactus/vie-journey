import { IsEmail, IsNotEmpty, IsString, Length, IsIn } from 'class-validator';

export class CreateAccountDto {

  @IsNotEmpty({ message: 'Please Enter Email' })
  @IsEmail({}, { message: 'Please Enter Valid Email' })
  email: string;

  @IsNotEmpty({ message: 'Please Enter Password' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

}
