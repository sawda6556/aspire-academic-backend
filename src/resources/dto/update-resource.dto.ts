import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ResourceStatus } from '../../common/enums';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @IsEnum(ResourceStatus)
  @IsOptional()
  status?: ResourceStatus;
}
