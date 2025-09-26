<script setup lang="ts">
import type { User } from "@/entities/user";
import RightArrowIcon from "@/shared/ui/Icons/RightArrowIcon.vue";
import { ChatDialog } from "@/widgets/ChatDialog";
import { ChatList } from "@/widgets/ChatList";
import type { ChatListItem } from "@/entities/chat";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { AUTH_TOKEN } from "@/shared/const/constants";

const props = defineProps<{
  user: User | null;
}>();

const route = useRoute();

if (isNaN(+route.params.id)) navigateTo("/");
if (!props.user) {
  navigateTo("/login");
}
const chatsListHidden = ref(false);

const config = useRuntimeConfig();
const token = useCookie(AUTH_TOKEN);

const { data: chatList } = await useAsyncData("accountChats", async () => {
  try {
    const response = await $fetch<ServerResponse<ChatListItem[]>>("/chats", {
      baseURL: import.meta.server ? config.SSR_API_URL : config.public.API_URL,
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
});

useSeoMeta({
  title: `Wayliss - Чаты`,
  ogTitle: `Wayliss - Чаты`,
  description: `Wayliss - Чаты`,
  ogDescription: `Wayliss - Чаты`,
});
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto">
    <button
      class="mb-4 md:hidden font-montserrat text-sm font-medium px-4 py-2 bg-slate-200 flex items-center gap-2 cursor-pointer rounded-lg border-2 border-slate-300"
      @click="chatsListHidden = !chatsListHidden"
    >
      <RightArrowIcon
        v-if="chatsListHidden"
        class="w-6 h-6 [&>*]:stroke-slate-500 rotate-180 group-hover:[&>*]:stroke-slate-400"
      />
      {{ chatsListHidden ? "Перейти к списку чатов" : "Перейти к чату" }}
      <RightArrowIcon
        v-if="!chatsListHidden"
        class="w-6 h-6 [&>*]:stroke-slate-500 group-hover:[&>*]:stroke-slate-400"
      />
    </button>
    <div class="flex justify-between md:gap-4">
      <div
        class="h-11/12 rounded-lg flex flex-col overflow-hidden max-h-[550px] md:max-h-[650px] transition-all duration-300 ease-linear bg-slate-200 overflow-y-scroll"
        :class="{
          'w-0': chatsListHidden,
          'w-full max-w-full md:max-w-[300px]': !chatsListHidden,
        }"
      >
        <ChatList v-if="user" :user="user" :chats-list="chatList" />
      </div>
      <ChatDialog
        v-if="route.params.id && user"
        :user="user"
        class="transition-all duration-300 ease-linear"
        :class="{
          '!w-0 md:!w-full': !chatsListHidden,
          'w-full': chatsListHidden,
        }"
      />
      <div
        v-else
        class="w-full rounded-lg flex flex-col justify-center items-center max-h-[550px] md:max-h-[650px] h-[550px] md:h-[650px] bg-slate-200 overflow-y-scroll"
      >
        <p
          class="text-sm text-slate-500 font-montserrat font-semibold overflow-hidden whitespace-nowrap"
        >
          Выберите чат
        </p>
      </div>
    </div>
  </section>
</template>
