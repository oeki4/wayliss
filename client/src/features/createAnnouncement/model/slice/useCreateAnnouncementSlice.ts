import type { ServerResponse } from "@/shared/types/serverResponse";
import type { IAnnouncement } from "@/entities/announcement";
import { AUTH_TOKEN } from "@/shared/const/constants";

export const useCreateAnnouncementSlice = defineStore(
  "createAnnouncement",
  () => {
    const config = useRuntimeConfig();
    const createAnnouncementModalIsOpen = ref(false);

    const showCreateAnnouncementModal = () => {
      createAnnouncementModalIsOpen.value = true;
    };

    const hideCreateAnnouncementModal = () => {
      createAnnouncementModalIsOpen.value = false;
    };

    const createAnnouncement = ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => {
      const token = useCookie(AUTH_TOKEN);
      return $fetch<ServerResponse<IAnnouncement>>("/announcements", {
        method: "POST",
        baseURL: config.public.API_URL,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });
    };

    return {
      showCreateAnnouncementModal,
      hideCreateAnnouncementModal,
      createAnnouncementModalIsOpen,
      createAnnouncement,
    };
  },
);
