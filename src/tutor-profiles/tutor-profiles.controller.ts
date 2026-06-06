import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TutorProfilesService } from './tutor-profiles.service';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { VerificationStatus } from '../common/enums';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tutor-profiles')
export class TutorProfilesController {
  constructor(private readonly tutorProfilesService: TutorProfilesService) {}

  @Get('marketplace')
  async getMarketplace() {
    return this.tutorProfilesService.findActiveTutors();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async findAll() {
    return this.tutorProfilesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.tutorProfilesService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyProfile(@Request() req, @Body() updateDto: UpdateTutorProfileDto) {
    return this.tutorProfilesService.update(req.user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'id_document', maxCount: 1 },
        { name: 'cert_document', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/verification',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async submitVerification(
    @Request() req,
    @UploadedFiles() files: { id_document?: Express.Multer.File[]; cert_document?: Express.Multer.File[] },
  ) {
    const idUrl = files.id_document ? `/uploads/verification/${files.id_document[0].filename}` : '';
    const certUrl = files.cert_document ? `/uploads/verification/${files.cert_document[0].filename}` : '';
    return this.tutorProfilesService.submitForVerification(req.user.id, idUrl, certUrl);
  }

  // Admin routes
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/review/:id')
  async adminReview(@Param('id') id: string, @Body('status') status: VerificationStatus) {
    return this.tutorProfilesService.adminReview(id, status);
  }
}
