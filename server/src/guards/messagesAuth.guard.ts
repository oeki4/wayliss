import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { ErrorCodes } from '@/shared/const/errorCodes';

@Injectable()
export class MessageAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(MessageAuthGuard.name, {
    timestamp: true,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      this.logger.error('JWT secret not provided');
      throw new WsException(ErrorCodes.INTERNAL_SERVER_ERROR.toString());
    }
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractTokenFromQuery(client);
    if (!token) {
      throw new WsException(ErrorCodes.UNAUTHORIZED.toString());
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      client.request['user'] = payload;
    } catch {
      throw new WsException(ErrorCodes.UNAUTHORIZED.toString());
    }
    return true;
  }

  private extractTokenFromQuery(client: Socket): string | undefined {
    return client.handshake.query?.token as string;
  }
}
