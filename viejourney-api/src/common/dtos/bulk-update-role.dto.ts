import { IsArray, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class BulkUpdateRoleDto {
  @IsArray({ message: 'userIds must be an array' })
  @ArrayMinSize(1, { message: 'At least one userId is required' })
  @IsString({ each: true, message: 'Each userId must be a string' })
  userIds: string[];

  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  role: string;
}
