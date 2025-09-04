import type { MessageType } from "@/shared/types/messageType";
import type { User } from "@/entities/user";

export interface MessageItem {
  id: number;
  type: MessageType;
  createdAt: string;

  content: string;

  userId: number;
  User: User;

  chatId: number;
}
