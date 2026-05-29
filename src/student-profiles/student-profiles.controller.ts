import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StudentProfilesService } from './student-profiles.service';
import { MailService } from '../mail/mail.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerificationStatus } from '../common/enums';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('student-profiles')
export class StudentProfilesController {
  constructor(
    private readonly studentProfilesService: StudentProfilesService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  async getAll() {
    return this.studentProfilesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.studentProfilesService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'id_document', maxCount: 1 },
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
    @UploadedFiles() files: { id_document?: Express.Multer.File[] },
  ) {
    const idUrl = files.id_document ? `/uploads/verification/${files.id_document[0].filename}` : '';
    const result = await this.studentProfilesService.submitForVerification(req.user.id, idUrl);

    if (idUrl) {
      this.mailService.notifyAdminOnVerificationUpload(req.user, [idUrl]);
    }

    return result;
  }

  // Admin routes
  @Post('admin/review/:id')
  async adminReview(@Param('id') id: string, @Body('status') status: VerificationStatus) {
    return this.studentProfilesService.adminReview(id, status);
  }
}
