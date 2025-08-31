<script setup lang="ts">
import { CreateAnnouncementModal } from "@/features/createAnnouncement";
import { Header } from "@/widgets/Header";
import { type User, useUserSlice } from "@/entities/user";
import type { ChatsJoinResponse } from "@/shared/types/socketMessage";
const userSlice = useUserSlice();
const { $socket, $convertSockMessageToJSON } = useNuxtApp();

defineProps<{
  user: User | null;
}>();

onMounted(() => {
  $socket.emit("chats:join");
  $socket.on("chats:join", (msg) => {
    const messageJSON = $convertSockMessageToJSON<ChatsJoinResponse>(msg);
    if (messageJSON.success) {
      console.log("Сообщения подключены");
    }
  });
});
</script>

<template>
  <div>
    <Header :user="userSlice.user || user" />
    <section class="min-h-[calc(100vh-200px)]">
      <slot :user="user" />
      <CreateAnnouncementModal />
    </section>
    <footer class="h-[100px]" />
  </div>
</template>
