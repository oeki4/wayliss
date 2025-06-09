import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '@/modules/app/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
})
export class ChatModule {}
