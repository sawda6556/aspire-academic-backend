import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

class ContactFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  message: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submitContactForm(@Body() contactFormDto: ContactFormDto) {
    try {
      await this.contactService.handleContactForm(
        contactFormDto.name,
        contactFormDto.email,
        contactFormDto.message,
      );
      return { message: 'Message sent successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to send message');
    }
  }
}
