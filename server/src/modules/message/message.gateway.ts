import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { MessageAuthGuard } from '@/guards/messagesAuth.guard';
import { IncomingMessage } from 'node:http';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { PrismaService } from '@/modules/app/prisma.service';

type SocketWithUser = Socket & {
  request: IncomingMessage & {
    user: JwtPayload;
  };
};

interface ConnectedUser {
  id: number;
  socketId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e10,
})
export class MessageGateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;

  connectedUsers: ConnectedUser[] = [];

  @UseGuards(MessageAuthGuard)
  @SubscribeMessage('chats:join')
  joinChats(
    @ConnectedSocket()
    client: SocketWithUser,
  ) {
    this.addConnectedUser({
      id: client.request.user.sub,
      socketId: client.id,
    });
    client.emit(
      'chats:join',
      JSON.stringify({
        success: true,
      }),
    );
  }

  @UseGuards(MessageAuthGuard)
  @SubscribeMessage('message:user:send')
  async sendMessage(
    @MessageBody() data: string,
    @ConnectedSocket()
    client: SocketWithUser,
  ) {
    const jsonData = JSON.parse(data) as {
      chatId: number;
      message: string;
    };
    if (
      !jsonData.message ||
      !jsonData.chatId ||
      !this.getConnectedUser(client.request.user.sub)
    )
      return;

    const chat = await this.prisma.chat.findUnique({
      where: {
        id: jsonData.chatId,
        UserChat: {
          some: {
            userId: client.request.user.sub,
          },
        },
      },
      include: {
        UserChat: true,
      },
    });
    if (!chat) return;

    const msg = await this.prisma.message.create({
      data: {
        userId: client.request.user.sub,
        chatId: jsonData.chatId,
        content: jsonData.message,
      },
    });
    client.emit('message:user:send', {
      success: true,
      data: msg,
    });
    chat.UserChat.forEach((el) => {
      if (el.userId !== client.request.user.sub) {
        const connectedUser = this.getConnectedUser(el.userId);
        if (connectedUser) {
          this.server.to(connectedUser.socketId).emit('message:get', {
            success: true,
            data: msg,
          });
        }
      }
    });
  }

  handleDisconnect(
    @ConnectedSocket()
    client: Socket,
  ) {
    this.deleteConnectedUser(client.id);
  }

  addConnectedUser(user: ConnectedUser) {
    const foundedUser = this.connectedUsers.find((el) => el.id === user.id);
    if (foundedUser) {
      this.connectedUsers = this.connectedUsers.map((el) => {
        if (el.id === foundedUser.id)
          return {
            id: foundedUser.id,
            socketId: user.socketId,
          };
        else return el;
      });
    } else this.connectedUsers.push(user);
  }

  deleteConnectedUser(socketId: string) {
    this.connectedUsers = this.connectedUsers.filter(
      (el) => el.socketId !== socketId,
    );
  }

  getConnectedUser(id: number) {
    return this.connectedUsers.find((el) => el.id === id);
  }
}
