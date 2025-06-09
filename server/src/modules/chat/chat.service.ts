import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/app/prisma.service';
import { JwtPayload } from '../auth/types/jwtPayload';
import { ErrorCodes } from '@/shared/const/errorCodes';
import { CreateChatDto } from './dto/create-chat.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async createChat(createChatDto: CreateChatDto, user: JwtPayload) {
    if (createChatDto.userId === user.sub) {
      throw new HttpException(
        'Internal server error',
        ErrorCodes.CHAT_WITH_YOURSELF,
      );
    }
    try {
      return this.prisma.$transaction(async (prisma) => {
        const existingChat = await prisma.chat.findFirst({
          where: {
            UserChat: {
              every: {
                userId: {
                  in: [createChatDto.userId, user.sub],
                },
              },
            },
          },
          include: {
            UserChat: {
              include: {
                User: {
                  select: {
                    id: true,
                    firstName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });
        if (existingChat)
          return {
            success: true,
            data: {
              chat: existingChat,
            },
          };
        const chat = await prisma.chat.create({
          data: {
            creatorId: user.sub,
          },
        });
        await prisma.userChat.create({
          data: {
            chatId: chat.id,
            userId: user.sub,
          },
        });

        await prisma.userChat.create({
          data: {
            chatId: chat.id,
            userId: createChatDto.userId,
          },
        });

        const updatedChat = await prisma.chat.findFirst({
          where: {
            id: chat.id,
          },
          include: {
            UserChat: {
              include: {
                User: {
                  select: {
                    id: true,
                    firstName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });
        return {
          success: true,
          data: {
            chat: updatedChat,
          },
        };
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          'Internal server error',
          ErrorCodes.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getAllChats(user: JwtPayload) {
    try {
      const chats = await this.prisma.chat.findMany({
        where: {
          UserChat: {
            some: {
              userId: user.sub,
            },
          },
        },
        include: {
          UserChat: {
            include: {
              User: {
                select: {
                  id: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      return {
        success: true,
        data: chats,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          'Internal server error',
          ErrorCodes.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
