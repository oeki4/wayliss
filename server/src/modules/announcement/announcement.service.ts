import { HttpException, Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { PrismaService } from '@/modules/app/prisma.service';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { ErrorCodes } from '@/shared/const/errorCodes';

@Injectable()
export class AnnouncementService {
  constructor(private prisma: PrismaService) {}
  async create(createAnnouncementDto: CreateAnnouncementDto, user: JwtPayload) {
    try {
      const announcement = await this.prisma.announcement.create({
        data: {
          title: createAnnouncementDto.title,
          description: createAnnouncementDto.description,
          userId: user.sub,
        },
      });

      return {
        success: true,
        data: announcement,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Internal server error',
        ErrorCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLastAnnouncements() {
    try {
      const announcements = await this.prisma.announcement.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: announcements,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Internal server error',
        ErrorCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
