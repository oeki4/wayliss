import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
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
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { DeletePhotoDto } from './dto/delete-photo.dto';
import { UpdateAnnouncementDto } from '@/modules/announcement/dto/update-announcement.dto';

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

  @UseGuards(AuthGuard)
  @Put()
  update(
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @Request() request: Request & { user: JwtPayload },
  ) {
    return this.announcementService.update(updateAnnouncementDto, request.user);
  }

  @Get('/last')
  getLastAnnouncements() {
    return this.announcementService.getLastAnnouncements();
  }

  @UseGuards(AuthGuard)
  @Get('/account')
  getAnnouncementsOnAccount(
    @Request() request: Request & { user: JwtPayload },
  ) {
    return this.announcementService.getAnnouncementsOnAccount(request.user.sub);
  }

  @Get('/:id')
  getAnnouncement(@Param('id') id: number) {
    return this.announcementService.getAnnouncement(id);
  }

  @Post('/upload')
  @UseGuards(AuthGuard)
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
    @Request() request: Request & { user: JwtPayload },
  ) {
    return this.announcementService.uploadPhoto(
      request.user,
      photo,
      uploadPhotoDto.announcementId,
    );
  }

  @Delete('/photo')
  @UseGuards(AuthGuard)
  deletePhoto(
    @Request() request: Request & { user: JwtPayload },
    @Body() deletePhotoDto: DeletePhotoDto,
  ) {
    return this.announcementService.deletePhoto(request.user, deletePhotoDto);
  }
}
