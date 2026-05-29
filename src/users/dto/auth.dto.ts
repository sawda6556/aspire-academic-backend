import { IsEmail, IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { UserType, Gender } from '../../common/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserType)
  user_type: UserType;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  full_name: string;

  @IsOptional()
  profile_data?: any;

  @IsOptional()
  @IsString()
  parent_id?: string; // Only for STUDENT
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
