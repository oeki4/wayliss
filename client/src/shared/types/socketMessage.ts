import type { MessageType } from "@/shared/types/messageType";

export interface ChatsJoinResponse {
  success: boolean;
}

export interface MessageGetResponse {
  success: boolean;
  data: {
    chatId: number;
    content: string;
    createdAt: Date;
    id: number;
    type: MessageType;
    userId: number;
  };
}
