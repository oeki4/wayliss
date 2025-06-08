<script setup lang="ts">
import { useUserSlice } from "@/entities/user";
import SendIcon from "@/shared/ui/Icons/SendIcon.vue";

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
      <!--      <div-->
      <!--        v-for="message in chatsStore.messages"-->
      <!--        class="w-full flex mt-4"-->
      <!--        :class="{ 'flex-row-reverse': message.userId !== recipient?.User?.id }"-->
      <!--      >-->
      <!--        <Message-->
      <!--          :avatar="`${config.public.apiUrl}/users/${message?.userId}/avatar`"-->
      <!--          :message="message.content"-->
      <!--          :right="message.userId !== recipient?.User?.id"-->
      <!--          :type="message.type"-->
      <!--          :date="message.createdAt"-->
      <!--        />-->
      <!--      </div>-->
    </div>
    <div class="w-full px-1 py-2 border-3 flex border-slate-300 rounded-b-lg">
      <input
        type="text"
        placeholder="Введите сообщение..."
        class="w-full text-slate-600 outline-0 mx-2"
      />
      <button
        class="cursor-pointer hover:bg-slate-700 hover:disabled:bg-transparent flex justify-center rounded-lg transition-all"
      >
        <SendIcon class="w-8 h-8 [&>*]:stroke-slate-300 p-1" />
      </button>
    </div>
  </div>
</template>
