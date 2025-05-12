import type { ServerResponse } from "@/shared/types/serverResponse";
import type { IAnnouncement } from "@/entities/announcement";
import { AUTH_TOKEN } from "@/shared/const/constants";

export const useCreateAnnouncementSlice = defineStore(
  "createAnnouncement",
  () => {
    const config = useRuntimeConfig();
    const createAnnouncementModalIsOpen = ref(false);
    const photos: Ref<
      Array<{
        file: File;
        url: string;
        progress: number;
      }>
    > = ref([]);

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

    const uploadPhoto = (photo: File) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = function (e) {
        console.log(`Отправлено ${e.loaded} из ${e.total} байт`);
        const index = photos.value.findIndex(
          (el) => el.file.name === photo.name,
        );
        photos.value[index].progress = Math.round((e.loaded / e.total) * 100);
      };
      const formData = new FormData();
      formData.append("photo", photo);
      xhr.open("POST", `${config.public.API_URL}/announcements/upload`);
      xhr.send(formData);
      xhr.onload = () => {
        console.log("OK");
      };
    };

    const addPhoto = (photo: { file: File; url: string }) => {
      photos.value.push({ ...photo, progress: 0 });
    };
    const deletePhoto = (name: string) => {
      photos.value = photos.value.filter((el) => el.file.name != name);
    };

    return {
      showCreateAnnouncementModal,
      uploadPhoto,
      addPhoto,
      deletePhoto,
      photos,
      hideCreateAnnouncementModal,
      createAnnouncementModalIsOpen,
      createAnnouncement,
    };
  },
);
