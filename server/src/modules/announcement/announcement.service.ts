import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { PrismaService } from '@/modules/app/prisma.service';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';

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

      return announcement;
    } catch (e) {
      console.log(e);
    }
  }

  async getLastAnnouncements() {
    try {
      const announcements = await this.prisma.announcement.findMany();

      return announcements;
    } catch (e) {
      console.log(e);
    }
  }
}
