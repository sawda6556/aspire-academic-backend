import { Controller, Post, Body, UseGuards, Put, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { MailService } from '../mail/mail.service';
import { UpdateEmailDto, DirectEmailDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('email')
  async updateEmail(@Req() req, @Body() dto: UpdateEmailDto) {
    if (!dto.email) {
      throw new BadRequestException('Email is mandatory');
    }
    return await this.usersService.updateEmail(req.user.id, dto.email);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/send-email')
  async sendDirectEmail(@Body() dto: DirectEmailDto) {
    await this.mailService.sendDirectEmail(dto.to, dto.subject, dto.message);
    return { success: true, message: 'Email sent successfully' };
  }
}
