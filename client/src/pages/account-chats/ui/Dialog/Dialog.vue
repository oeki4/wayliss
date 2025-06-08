<script setup lang="ts">
import { useUserSlice } from "@/entities/user";
import SendIcon from "@/shared/ui/Icons/SendIcon.vue";
import { MessageItem } from "@/entities/chat";

const config = useRuntimeConfig();

const { user } = storeToRefs(useUserSlice());
</script>
<template>
  <div
    class="w-full rounded-lg flex flex-col max-h-[550px] md:max-h-[650px] bg-slate-200 overflow-y-scroll"
  >
    <div
      class="px-3 py-2 flex items-center gap-2.5 border-3 border-slate-300 rounded-t-lg"
    >
      <img
        :src="`${config.public.API_URL}/users/${user?.id}/avatar`"
        :alt="`${user?.firstName} avatar`"
        class="w-15 h-15 rounded-full border-3 border-slate-400"
      />
      <h4 class="font-montserrat text-slate-600 font-semibold">
        {{ user?.firstName }}
      </h4>
    </div>
    <div class="px-3 py-2 h-full border-x-3 overflow-y-scroll border-slate-300">
      <div class="w-full flex mt-4 justify-end">
        <MessageItem
          :avatar="`${config.public.API_URL}/users/${user?.id}/avatar`"
          message="Привет!"
          position="right"
        />
      </div>
      <div class="w-full flex mt-4">
        <MessageItem
          :avatar="`${config.public.API_URL}/users/${user?.id}/avatar`"
          message="Дарова!"
          position="left"
        />
      </div>
    </div>
    <div class="w-full px-1 py-2 border-3 flex border-slate-300 rounded-b-lg">
      <input
        type="text"
        placeholder="Введите сообщение..."
        class="w-full text-slate-600 placeholder:text-slate-500 outline-0 mx-2"
      />
      <button
        class="cursor-pointer hover:bg-slate-700 group hover:disabled:bg-transparent flex justify-center rounded-lg transition-all"
      >
        <SendIcon
          class="w-8 h-8 [&>*]:stroke-slate-500 group-hover:[&>*]:stroke-slate-400 p-1"
        />
      </button>
    </div>
  </div>
</template>
