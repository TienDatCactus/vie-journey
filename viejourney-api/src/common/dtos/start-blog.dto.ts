import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class StartBlogDto {
  @IsString({ message: 'Địa điểm phải là một chuỗi.' })
  @IsNotEmpty({ message: 'Địa điểm không được để trống.' })
  @MaxLength(100, { message: 'Địa điểm không được vượt quá 100 ký tự.' })
  location: string;
}
