import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { AuthGuard } from '@/guards/auth.guard';

@Controller('announcement')
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
}
