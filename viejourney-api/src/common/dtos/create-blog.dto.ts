import {
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
  Length,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

export class CreateBlogDto {
  @IsString({ message: 'Tiêu đề phải là một chuỗi.' })
  @Length(5, 100, {
    message: 'Tiêu đề phải có độ dài từ 5 đến 100 ký tự.',
  })
  title: string;

  @IsOptional()
  @IsString({ message: 'Slug phải là một chuỗi.' })
  @Length(3, 100, {
    message: 'Slug phải có độ dài từ 3 đến 100 ký tự.',
  })
  slug?: string;

  @IsString({ message: 'Nội dung phải là một chuỗi.' })
  @Length(20, 5000, {
    message: 'Nội dung phải có độ dài từ 20 đến 5000 ký tự.',
  })
  content: string;

  @IsOptional()
  @IsString({ message: 'Tóm tắt phải là một chuỗi.' })
  @MaxLength(300, {
    message: 'Tóm tắt không được vượt quá 300 ký tự.',
  })
  summary?: string;

  @IsOptional()
  @IsArray({ message: 'Tags phải là một mảng chuỗi.' })
  @ArrayMaxSize(10, {
    message: 'Tối đa chỉ được 10 tags.',
  })
  @IsString({ each: true, message: 'Mỗi tag phải là một chuỗi.' })
  tags?: string[];

  @IsOptional()
  @IsString({ message: 'Ảnh bìa phải là một chuỗi URL.' })
  @MaxLength(500, {
    message: 'Đường dẫn ảnh bìa không được vượt quá 500 ký tự.',
  })
  coverImage?: string;

  @IsOptional()
  @IsString({ message: 'Địa điểm phải là một chuỗi.' })
  location?: string | null;
}
