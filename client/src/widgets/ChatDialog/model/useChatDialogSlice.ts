import type { MessageItem } from "@/entities/message";
import { ref } from "vue";

export const useChatDialogSlice = defineStore("chatDialog", () => {
  const messages: Ref<MessageItem[]> = ref([]);

  const setMessages = (payload: MessageItem[]) => {
    messages.value = payload;
  };

  const addMessage = (payload: MessageItem) => {
    messages.value.push(payload);
  };

  return { setMessages, messages, addMessage };
});
