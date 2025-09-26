import type { MessageItem } from "@/entities/message";
import { ref } from "vue";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { AUTH_TOKEN } from "@/shared/const/constants";

export const useChatDialogSlice = defineStore("chatDialog", () => {
  const messages: Ref<MessageItem[]> = ref([]);
  const page = ref(1);
  const isLastPage = ref(false);
  const chatId: Ref<null | number> = ref(null);

  const setMessages = (payload: MessageItem[]) => {
    messages.value = payload;
  };

  const setChatId = (payload: number) => {
    chatId.value = payload;
  };

  const addMessage = (payload: MessageItem) => {
    messages.value.push(payload);
  };

  const fetchChat = async () => {
    if (isLastPage.value) return;
    const token = useCookie(AUTH_TOKEN);
    const config = useRuntimeConfig();
    try {
      const response = await $fetch<
        ServerResponse<{
          id: number;
          creatorId: number;
          Message: MessageItem[];
        }>
      >(`/chats/${chatId.value}?page=${page.value + 1}`, {
        baseURL: import.meta.server
          ? config.SSR_API_URL
          : config.public.API_URL,
        headers: {
          authorization: `Bearer ${token.value}`,
        },
      });

      if (response.data.Message.length > 0) page.value++;
      else {
        isLastPage.value = true;
        return;
      }

      messages.value = [...response.data.Message.reverse(), ...messages.value];
    } catch (e) {
      console.error(e);
    }
  };

  return {
    setMessages,
    messages,
    addMessage,
    fetchChat,
    setChatId,
    isLastPage,
  };
});
