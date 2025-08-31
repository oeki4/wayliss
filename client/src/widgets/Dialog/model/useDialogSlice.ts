import type { MessageItem } from "@/entities/message";

export const useDialogSlice = defineStore("dialog", () => {
  const messages: Ref<MessageItem[]> = ref([]);

  const setMessages = (payload: MessageItem[]) => {
    messages.value = payload;
  };

  const addMessage = (payload: MessageItem) => {
    messages.value.push(payload);
  };

  return { setMessages, messages, addMessage };
});
