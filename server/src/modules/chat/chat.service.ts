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
      // 1. Получаем чаты с пользователями
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
                  firstName: true,
                },
              },
            },
          },
        },
      });

      // 2. Получаем количество непрочитанных сообщений по chatId
      const unreadCounts = await this.prisma.message.groupBy({
        by: ['chatId'],
        where: {
          chatId: { in: chats.map((c) => c.id) },
          userId: { not: user.sub }, // не свои сообщения
          MessageRead: {
            none: { userId: user.sub }, // нет отметки о прочтении
          },
        },
        _count: { id: true },
      });

      // 3. Объединяем
      const data = chats.map((chat) => {
        const unread = unreadCounts.find((uc) => uc.chatId === chat.id);
        return {
          ...chat,
          unreadCount: unread?._count.id ?? 0,
        };
      });

      return {
        success: true,
        data,
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

  async getChatById(user: JwtPayload, chatId: number, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const chat = await this.prisma.chat.findFirst({
        where: {
          id: chatId,
          UserChat: {
            some: {
              userId: user.sub,
            },
          },
        },
        include: {
          UserChat: {
            include: {
              User: true,
            },
          },
          Message: {
            orderBy: {
              createdAt: 'desc', // последние сообщения первыми
            },
            skip,
            take: limit,
            include: {
              User: {
                omit: {
                  password: true,
                },
              },
            },
          },
        },
      });

      if (!chat) {
        throw new HttpException('Chat not found', ErrorCodes.CHAT_NOT_FOUND);
      }

      if (page === 1) {
        await this.markMessagesAsRead(chatId, user.sub);
      }

      return {
        success: true,
        data: {
          ...chat,
        },
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          'Internal server error',
          ErrorCodes.INTERNAL_SERVER_ERROR,
        );
      }
      throw err;
    }
  }

  async markMessagesAsRead(chatId: number, userId: number) {
    await this.prisma.$transaction(async (tx) => {
      const unreadMessages = await tx.message.findMany({
        where: {
          chatId,
          MessageRead: {
            none: {
              userId: userId, // важно явно указывать
            },
          },
        },
        select: { id: true },
      });

      console.log(unreadMessages);

      if (unreadMessages.length === 0) return;

      await tx.messageRead.createMany({
        data: unreadMessages.map((msg) => ({
          messageId: msg.id,
          userId,
        })),
        skipDuplicates: true,
      });
    });
  }
}
