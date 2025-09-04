import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post()
  createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.chatService.createChat(createChatDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAllChats(@Req() req: Request & { user: JwtPayload }) {
    return this.chatService.getAllChats(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':chatId')
  getChatById(
    @Req() req: Request & { user: JwtPayload },
    @Param('chatId') chatId: number,
    @Query('page') page: number,
  ) {
    return this.chatService.getChatById(req.user, chatId, page);
  }
}
