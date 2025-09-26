import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ServerResponse } from "@/shared/types/serverResponse";
import type { Chat } from "@/entities/chat";

export const useRespondAdSlice = defineStore("respondAd", () => {
  const respondAdModalVisible = ref(false);

  const setRespondAdModalVisible = (visible: boolean) => {
    respondAdModalVisible.value = visible;
  };

  const config = useRuntimeConfig();

  const createChat = ({
    message,
    announcementId,
  }: {
    message: string;
    announcementId: number;
  }) => {
    const token = useCookie(AUTH_TOKEN);
    return $fetch<ServerResponse<Chat>>("/chats", {
      method: "POST",
      baseURL: config.public.API_URL,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        message,
        announcementId,
      }),
    });
  };

  return {
    respondAdModalVisible,
    setRespondAdModalVisible,
    createChat,
  };
});
