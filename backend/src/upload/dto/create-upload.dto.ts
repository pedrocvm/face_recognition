import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'Image URL cannot be void' })
  imageUrl: string;

  @IsString()
  name?: string;

  @IsArray()
  data?: any[];
}
