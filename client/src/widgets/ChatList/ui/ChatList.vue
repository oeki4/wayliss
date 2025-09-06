<script setup lang="ts">
import { ChatItem, type ChatListItem } from "@/entities/chat";
import { useAlertSlice } from "@/entities/alert";
import type { User } from "@/entities/user";
import { useChatListSlice } from "@/widgets/ChatList/model/useChatListSlice";
import type { MessageGetResponse } from "@/shared/types/socketMessage";
const { setAlert } = useAlertSlice();
const { $socket, $convertSockMessageToJSON } = useNuxtApp();

const props = defineProps<{
  chatsList: ChatListItem[];
  user: User;
}>();

if (!props.chatsList) {
  setAlert("Ошибка при загрузке ваших чатов");
}

const chatsListSlice = useChatListSlice();

const { setChats, clearUnreadMessages, addUnreadMessage } = chatsListSlice;

const { chats } = storeToRefs(chatsListSlice);

if (!chats.value.length) {
  setChats(props.chatsList);
}

const handleClickChat = (chatId: number) => {
  clearUnreadMessages(chatId);
  navigateTo(`/account/chats/${chatId}`);
};

onMounted(async () => {
  $socket.on("message:get", async (msg) => {
    const messageJSON = $convertSockMessageToJSON<MessageGetResponse>(msg);
    if (messageJSON.success) {
      console.log("Получено новое сообщение: ", messageJSON);
      addUnreadMessage(messageJSON.data.chatId);
    }
  });
});
</script>

<template>
  <ChatItem
    v-for="item of chats"
    :key="item.id"
    :user="user"
    :chat="item"
    @click="handleClickChat(item.id)"
  />
</template>
