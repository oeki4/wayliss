<script setup lang="ts">
import { ChatItem, type ChatListItem } from "@/entities/chat";
import { useAlertSlice } from "@/entities/alert";
import type { User } from "@/entities/user";
const { setAlert } = useAlertSlice();

const props = defineProps<{
  chats: ChatListItem[];
  user: User;
}>();

if (!props.chats) {
  setAlert("Ошибка при загрузке ваших чатов");
}
</script>

<template>
  <ChatItem v-for="item of chats" :key="item.id" :user="user" :chat="item" />
</template>
