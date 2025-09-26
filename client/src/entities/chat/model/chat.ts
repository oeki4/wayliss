export interface ChatListItem extends Chat {
  unreadCount: number;
}

export interface Chat {
  id: number;
  creatorId: number;
  announcementId: number;
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
