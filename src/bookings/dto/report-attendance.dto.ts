import { IsEnum } from 'class-validator';
import { AttendanceStatus } from '../../common/enums';

export class ReportAttendanceDto {
  @IsEnum(AttendanceStatus)
  attendance: AttendanceStatus;
}
