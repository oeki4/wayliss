<script setup lang="ts">
import type { ChatListItem } from "@/entities/chat";
import type { User } from "@/entities/user";
const config = useRuntimeConfig();

const props = defineProps<{
  chat: ChatListItem;
  user: User;
}>();

const companion = props.chat.UserChat.find((el) => el.userId !== props.user.id);

if (!companion) navigateTo("/chats");
</script>

<template>
  <button
    class="text-slate-200 max-h-[88px] flex px-3 py-2 cursor-pointer hover:bg-slate-300 transition-all gap-2.5 items-center"
  >
    <img
      :src="`${config.public.API_URL}/users/${companion?.User.id}/avatar`"
      :alt="`${companion?.User.id}`"
      class="min-w-15 w-15 min-h-15 h-15 border-slate-400 rounded-full border-3"
      style="width: 60px; height: 60px"
      format="webp"
      quality="80"
      width="60"
      height="60"
      lazy
    />
    <div class="w-full flex items-center flex-col">
      <div class="w-full flex items-center justify-between gap-2.5">
        <p class="font-montserrat text-slate-700 font-semibold text-base">
          {{ companion?.User.firstName }}
        </p>
        <p
          v-if="chat.unreadCount"
          class="px-2 py-1 font-montserrat font-medium rounded-full bg-green-600"
        >
          {{ chat.unreadCount }}
        </p>
      </div>
      <!--      <div class="w-full max-w-full flex flex-col">-->
      <!--        <p-->
      <!--          class="text-sm max-w-[200px] w-full text-slate-500 font-montserrat font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis"-->
      <!--        >-->
      <!--          Привет-->
      <!--        </p>-->
      <!--        <p-->
      <!--          v-if="true"-->
      <!--          class="text-sm w-full text-end text-slate-500 font-montserrat f"-->
      <!--        >-->
      <!--          {{ DateTime.now().toFormat("HH:mm dd.LL.yy") }}-->
      <!--        </p>-->
      <!--      </div>-->
    </div>
  </button>
</template>
