import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
