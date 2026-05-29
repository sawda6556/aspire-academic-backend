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
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TutorProfilesService } from './tutor-profiles.service';
import { MailService } from '../mail/mail.service';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { VerificationGuard } from '../auth/guards/verification.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { VerificationStatus, UserType, DbsStatus } from '../common/enums';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tutor-profiles')
export class TutorProfilesController {
  constructor(
    private readonly tutorProfilesService: TutorProfilesService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Get('marketplace')
  async getMarketplace() {
    return this.tutorProfilesService.findActiveTutors();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAll() {
    return this.tutorProfilesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.TUTOR)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.tutorProfilesService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.TUTOR)
  @Put('me')
  async updateMyProfile(@Request() req, @Body() updateDto: UpdateTutorProfileDto) {
    return this.tutorProfilesService.update(req.user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.TUTOR)
  @Post('verify')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'id_document', maxCount: 1 },
        { name: 'cert_document', maxCount: 1 },
        { name: 'address_proof', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB limit
        },
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
            return cb(new BadRequestException('Only images and PDFs are allowed'), false);
          }
          cb(null, true);
        },
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
    @UploadedFiles()
    files: {
      id_document?: Express.Multer.File[];
      cert_document?: Express.Multer.File[];
      address_proof?: Express.Multer.File[];
    },
  ) {
    const idUrl = files.id_document
      ? `/uploads/verification/${files.id_document[0].filename}`
      : '';
    const certUrl = files.cert_document
      ? `/uploads/verification/${files.cert_document[0].filename}`
      : '';
    const addressUrl = files.address_proof
      ? `/uploads/verification/${files.address_proof[0].filename}`
      : '';
    const result = await this.tutorProfilesService.submitForVerification(
      req.user.id,
      idUrl,
      certUrl,
      addressUrl,
    );

    // Notify admin
    const documentUrls: string[] = [];
    if (idUrl) documentUrls.push(idUrl);
    if (certUrl) documentUrls.push(certUrl);
    if (addressUrl) documentUrls.push(addressUrl);
    if (documentUrls.length > 0) {
      this.mailService.notifyAdminOnVerificationUpload(req.user, documentUrls);
    }

    return result;
  }

  @UseGuards(JwtAuthGuard, VerificationGuard)
  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.tutorProfilesService.findOne(id);
  }

  // Admin routes
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/review/:id')
  async adminReview(@Param('id') id: string, @Body('status') status: VerificationStatus) {
    return this.tutorProfilesService.adminReview(id, status);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/review-dbs/:id')
  async adminReviewDbs(@Param('id') id: string, @Body('status') status: DbsStatus) {
    return this.tutorProfilesService.adminReviewDbs(id, status);
  }
}
