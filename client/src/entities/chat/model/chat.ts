export interface ChatListItem {
  id: number;
  creatorId: number;
  UserChat: Array<{
    id: number;
    userId: number;
    chatId: number;
    User: {
      id: number;
      avatar: string;
      firstName: string;
    };
  }>;
}
