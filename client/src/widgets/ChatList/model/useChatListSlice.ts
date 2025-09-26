import type { ChatListItem } from "@/entities/chat";

export const useChatListSlice = defineStore("chatList", () => {
  const chats: Ref<ChatListItem[]> = ref([]);
  const setChats = (payload: ChatListItem[]) => {
    chats.value = payload;
  };

  const clearUnreadMessages = (chatId: number) => {
    chats.value = chats.value.map((chat) =>
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
    );
  };

  const addUnreadMessage = (chatId: number) => {
    chats.value = chats.value.map((chat) =>
      chat.id === chatId
        ? { ...chat, unreadCount: chat.unreadCount + 1 }
        : chat,
    );
  };

  return {
    chats,
    setChats,
    clearUnreadMessages,
    addUnreadMessage,
  };
});
