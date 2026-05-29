import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsArray, Min } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  file_url: string;

  @IsString()
  @IsOptional()
  preview_url?: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @IsString()
  @IsOptional()
  grade_level?: string;
}
