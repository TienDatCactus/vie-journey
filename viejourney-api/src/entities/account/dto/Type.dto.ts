import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class TypeDto {
  @IsIn(['AVATAR', 'BANNER', 'CONTENT'], {
    message: 'Type must be one of: AVATAR, BANNER, CONTENT',
  })
  Type: string;
}
