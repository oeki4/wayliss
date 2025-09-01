<script setup lang="ts">
import SendIcon from "@/shared/ui/Icons/SendIcon.vue";
import { Message, type MessageItem } from "@/entities/message";
import type { MessageGetResponse } from "@/shared/types/socketMessage";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { User } from "@/entities/user";
import { useChatDialogSlice } from "../model/useChatDialogSlice";
const { $socket, $convertSockMessageToJSON } = useNuxtApp();

const config = useRuntimeConfig();

const token = useCookie(AUTH_TOKEN);
const route = useRoute();

defineProps<{
  user: User;
}>();

const { data: chat } = await useAsyncData(
  `chat-${route.params.id}`,
  async () => {
    try {
      const response = await $fetch<
        ServerResponse<{
          id: number;
          creatorId: number;
          Message: MessageItem[];
        }>
      >(`/chats/${route.params.id}`, {
        baseURL: import.meta.server
          ? config.SSR_API_URL
          : config.public.API_URL,
        headers: {
          authorization: `Bearer ${token.value}`,
        },
      });

      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
);

const chatDialogSlice = useChatDialogSlice();
const { messages } = storeToRefs(chatDialogSlice);
const { setMessages, addMessage } = chatDialogSlice;

const displayedMessages = computed(() => {
  return messages.value.length ? messages.value : chat.value?.Message || [];
});

onMounted(() => {
  $socket.on("message:get", (msg) => {
    const messageJSON = $convertSockMessageToJSON<MessageGetResponse>(msg);
    if (messageJSON.success) {
      console.log("Получено новое сообщение: ", messageJSON);
      addMessage(messageJSON.data);
    }
  });
  if (chat.value?.Message) setMessages(chat.value?.Message);
});
</script>
<template>
  <div
    class="w-full rounded-lg flex flex-col max-h-[550px] md:max-h-[650px] bg-slate-200 overflow-y-scroll"
  >
    <div
      class="px-3 py-2 flex items-center gap-2.5 border-3 border-slate-300 rounded-t-lg"
    >
      <NuxtImg
        :src="`${config.public.API_URL}/users/${user?.id}/avatar`"
        :alt="`${user?.firstName}'s avatar`"
        class="w-15 h-15 rounded-full border-3 border-slate-400"
        format="webp"
        quality="80"
        width="60"
        height="60"
        lazy
      />
      <h4 class="font-montserrat text-slate-600 font-semibold">
        {{ user?.firstName }}
      </h4>
    </div>
    <div class="px-3 py-2 h-full border-x-3 overflow-y-scroll border-slate-300">
      <div v-if="displayedMessages.length">
        <template
          v-for="messageItem in displayedMessages"
          :key="messageItem?.chatId"
        >
          <div
            class="w-full flex mt-4"
            :class="`${messageItem?.User.id === user.id ? 'justify-end' : 'justify-start'}`"
          >
            <Message
              :avatar="`${config.public.API_URL}/users/${messageItem.User?.id}/avatar`"
              :message="`${messageItem?.content}`"
              :position="`${messageItem?.User.id === user.id ? 'right' : 'left'}`"
            />
          </div>
        </template>
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
