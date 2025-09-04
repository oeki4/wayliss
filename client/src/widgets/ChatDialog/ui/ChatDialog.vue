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
const { messages, isLastPage } = storeToRefs(chatDialogSlice);
const { setMessages, addMessage, fetchChat, setChatId } = chatDialogSlice;

const displayedMessages = computed(() => {
  return messages.value.length
    ? messages.value
    : [...(chat.value?.Message ?? [])].reverse();
});

const messagesContainer = ref<HTMLDivElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(displayedMessages, async () => {
  await scrollToBottom();
});

const sendMessage = async (message: string) => {
  if (!message) return;
  if (!chat.value?.id) {
    throw new Error("Chat id don't provided");
  }
  $socket.emit(
    "message:user:send",
    JSON.stringify({
      chatId: chat.value.id,
      message,
    }),
  );
};

const message = ref("");

const handleScrollDialog = async (e: Event) => {
  if (!messagesContainer.value) return;
  const target = e.target as HTMLElement;
  if (target.scrollTop === 0) {
    const oldScrollHeight = messagesContainer.value.scrollHeight;
    await fetchChat();

    if (isLastPage.value) return;
    await nextTick();

    const newScrollHeight = messagesContainer.value.scrollHeight;
    messagesContainer.value.scrollTop = newScrollHeight - oldScrollHeight;
  }
};

onMounted(async () => {
  if (chat.value) {
    setChatId(chat.value?.id);
  }

  $socket.on("message:get", async (msg) => {
    const messageJSON = $convertSockMessageToJSON<MessageGetResponse>(msg);
    if (messageJSON.success) {
      console.log("Получено новое сообщение: ", messageJSON);
      addMessage(messageJSON.data);
      await scrollToBottom();
    }
  });

  $socket.on("message:user:send", async (msg) => {
    const messageJSON = $convertSockMessageToJSON<MessageGetResponse>(msg);
    if (messageJSON.success) {
      console.log("Сообщение успешно отправлено: ", messageJSON);
      addMessage(messageJSON.data);
      message.value = "";
      await scrollToBottom();
    }
  });
  if (chat.value?.Message) setMessages(chat.value?.Message.reverse());
  await scrollToBottom();
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
    <div
      ref="messagesContainer"
      class="px-3 py-2 h-full border-x-3 overflow-y-scroll border-slate-300"
      @scroll="handleScrollDialog"
    >
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
              :date="messageItem.createdAt"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="w-full px-1 py-2 border-3 flex border-slate-300 rounded-b-lg">
      <input
        v-model="message"
        type="text"
        placeholder="Введите сообщение..."
        class="w-full text-slate-600 placeholder:text-slate-500 outline-0 mx-2"
        @keyup.enter="sendMessage(message)"
      />
      <button
        class="cursor-pointer hover:bg-slate-700 group hover:disabled:bg-transparent flex justify-center rounded-lg transition-all"
        @click="sendMessage(message)"
      >
        <SendIcon
          class="w-8 h-8 [&>*]:stroke-slate-500 group-hover:[&>*]:stroke-slate-400 p-1"
        />
      </button>
    </div>
  </div>
</template>
