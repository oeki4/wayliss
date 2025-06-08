<script setup lang="ts">
import type { User } from "@/entities/user";
import { ChatItem } from "@/entities/chat";
import Dialog from "./Dialog/Dialog.vue";

const props = defineProps<{
  user: User | null;
}>();

if (!props.user) navigateTo("/login");
const chatsListHidden = ref(false);

useSeoMeta({
  title: `Wayliss - Чаты`,
  ogTitle: `Wayliss - Чаты`,
  description: `Wayliss - Чаты`,
  ogDescription: `Wayliss - Чаты`,
});
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto">
    <button class="mb-4 md:hidden" @click="chatsListHidden = !chatsListHidden">
      Показать чаты
    </button>
    <div class="flex justify-between" :class="{ 'gap-4': !chatsListHidden }">
      <div
        class="h-11/12 rounded-lg flex flex-col overflow-hidden max-h-[550px] md:max-h-[650px] transition-all duration-300 ease-linear bg-slate-200 overflow-y-scroll"
        :class="{
          'w-0': chatsListHidden,
          'w-full max-w-full md:max-w-[300px]': !chatsListHidden,
        }"
      >
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
      </div>
      <Dialog
        class="transition-all duration-300 ease-linear"
        :class="{
          '!w-0 md:!w-full': !chatsListHidden,
          'w-full': chatsListHidden,
        }"
      />
    </div>
  </section>
</template>
