import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/modules/app/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import { ErrorCodes } from '@/shared/const/errorCodes';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma/client';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UsersService.name, {
    timestamp: true,
  });
  async create(createUserDto: CreateUserDto, avatar?: Express.Multer.File) {
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');
    if (!saltRounds) {
      this.logger.error('Salt rounds not provided');
      throw new HttpException(
        'Internal server error',
        ErrorCodes.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      const hash = await bcrypt.hash(createUserDto.password, +saltRounds);
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hash,
          age: +createUserDto.age,
          firstName: createUserDto.firstName,
          description: createUserDto.description,
        },
        omit: {
          password: true,
        },
      });
      if (avatar) {
        const extension = avatar.originalname.match(/\.([^.]+)$/)?.[1];
        fs.writeFileSync(`./avatars/${user.id}.${extension}`, avatar.buffer);
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            avatar: `${user.id}.${extension}`,
          },
        });
      }

      return {
        success: true,
        data: {
          user,
        },
      };
    } catch (err) {
      console.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException(
            'User already exists',
            ErrorCodes.USER_ALREADY_EXISTS,
          );
        }
      }
    }
  }
  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async updateUser(user: JwtPayload, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.sub,
        },
        data: {
          firstName: updateUserDto.firstName,
          description: updateUserDto.description,
        },
        select: {
          email: true,
          firstName: true,
          description: true,
          avatar: true,
          id: true,
        },
      });

      if (!updatedUser) {
        if (!user) {
          throw new UnauthorizedException();
        }
      }
      return {
        success: true,
        data: updatedUser,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Internal Server Error',
        ErrorCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
