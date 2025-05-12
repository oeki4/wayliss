import {
  Body,
  Controller,
  Get,
  HttpException,
  ParseFilePipeBuilder,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { AuthGuard } from '@/guards/auth.guard';
import { ErrorCodes } from '@/shared/const/errorCodes';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPhotoDto } from '@/modules/announcement/dto/upload-photo.dto';

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @Request() request: Request & { user: JwtPayload },
  ) {
    return this.announcementService.create(createAnnouncementDto, request.user);
  }

  @Get('/last')
  getLastAnnouncements() {
    return this.announcementService.getLastAnnouncements();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('photo'))
  uploadPhoto(
    @Body() uploadPhotoDto: UploadPhotoDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 2 * 1024 * 1024 * 1024,
        })
        .build({
          fileIsRequired: false,
          exceptionFactory: () => {
            throw new HttpException(
              'Incorrect photo',
              ErrorCodes.INCORRECT_PHOTO,
            );
          },
        }),
    )
    photo: Express.Multer.File,
  ) {
    return this.announcementService.uploadPhoto(
      photo,
      uploadPhotoDto.announcementId,
    );
  }
}
