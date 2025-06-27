import {
  IsString,
  IsOptional,
  IsArray,
  Length,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

export class UpdateBlogDraftDto {
  @IsOptional()
  @IsString({ message: 'Tiêu đề phải là một chuỗi.' })
  @Length(5, 100, {
    message: 'Tiêu đề phải có độ dài từ 5 đến 100 ký tự.',
  })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung phải là một chuỗi.' })
  @Length(0, 50000, {
    message: 'Nội dung không được vượt quá 50000 ký tự.',
  })
  content?: string;

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
}
