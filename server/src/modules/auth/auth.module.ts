import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '@/modules/app/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
