import type { MessageItem } from "@/entities/message";

export interface ChatsJoinResponse {
  success: boolean;
}

export interface MessageGetResponse {
  success: boolean;
  data: MessageItem;
}
