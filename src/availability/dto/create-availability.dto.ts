import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateAvailabilityDto {
  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week: number;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;
}
