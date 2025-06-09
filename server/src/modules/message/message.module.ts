import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { PrismaService } from '@/modules/app/prisma.service';

@Module({
  providers: [MessageGateway, PrismaService],
})
export class MessageModule {}
