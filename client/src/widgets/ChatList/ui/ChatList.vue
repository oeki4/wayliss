<script setup lang="ts">
import { ChatItem, type ChatListItem } from "@/entities/chat";

defineProps<{
  chats: ChatListItem[];
}>();
</script>

<template>
  <ChatItem v-for="item of chats" :key="item.id" :chat="item" />
</template>
