import { IsUUID, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  tutor_id: string;

  @IsUUID()
  @IsOptional()
  student_id?: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsOptional()
  @IsBoolean()
  is_trial?: boolean;
}
