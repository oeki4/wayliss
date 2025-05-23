import { HttpException, Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { PrismaService } from '@/modules/app/prisma.service';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { ErrorCodes } from '@/shared/const/errorCodes';
import * as fs from 'node:fs';
import { randomString } from '@/shared/utils/randomString';

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

  async getAnnouncement(id: number) {
    if (!id) {
      return {
        success: true,
        data: null,
      };
    }

    try {
      const announcement = await this.prisma.announcement.findFirst({
        where: {
          id,
        },
        include: {
          AnnouncementPhoto: true,
          User: {
            select: {
              id: true,
              firstName: true,
              avatar: true,
            },
          },
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
        take: 8,
        include: {
          AnnouncementPhoto: true,
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

  async uploadPhoto(photo: Express.Multer.File, announcementId: number) {
    try {
      const extension = photo.originalname.match(/\.([^.]+)$/)?.[1];
      const randomName = randomString();
      fs.writeFileSync(`./uploads/${randomName}.${extension}`, photo.buffer);
      const announcementPhoto = await this.prisma.announcementPhoto.create({
        data: {
          name: `${randomName}.${extension}`,
          announcementId,
        },
      });
      return {
        success: true,
        data: announcementPhoto,
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
