import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { PrismaService } from '@/modules/app/prisma.service';
import { ErrorCodes } from '@/shared/const/errorCodes';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name, {
    timestamp: true,
  });
  async signIn(email: string, pass: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        throw new UnauthorizedException();
      }
      const payload: JwtPayload = { sub: user.id, email: user.email };
      try {
        const token = await this.jwtService.signAsync(payload);
        return {
          success: true,
          data: {
            token,
          },
        };
      } catch (err) {
        this.logger.error(err);
        throw new HttpException(
          'Internal Server Error',
          ErrorCodes.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw new HttpException('Unauthorized', ErrorCodes.UNAUTHORIZED);
      }
    }
  }

  async profile(jwtPayload: JwtPayload) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: jwtPayload.sub,
        },
        select: {
          email: true,
          id: true,
          description: true,
          avatar: true,
          firstName: true,
        },
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      return {
        success: true,
        data: user,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw new HttpException(
          'Internal server error',
          ErrorCodes.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
