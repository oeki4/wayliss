import type { ServerResponse } from "@/shared/types/serverResponse";
import type { IAnnouncement } from "@/entities/announcement";
import { AUTH_TOKEN } from "@/shared/const/constants";

export const useCreateAnnouncementSlice = defineStore(
  "createAnnouncement",
  () => {
    const config = useRuntimeConfig();
    const createAnnouncementModalIsOpen = ref(false);
    const createdAnnouncement: Ref<IAnnouncement | null> = ref(null);
    const photos: Ref<
      Array<{
        file: File;
        url: string;
        progress: number;
        loaded: boolean;
      }>
    > = ref([]);

    const showCreateAnnouncementModal = () => {
      createAnnouncementModalIsOpen.value = true;
    };

    const setCreatedAnnouncement = (payload: IAnnouncement) => {
      createdAnnouncement.value = payload;
    };

    const clearPhotos = () => {
      photos.value = [];
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

    const uploadPhoto = (photo: File, announcementId: number) => {
      return new Promise((resolve, reject) => {
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
        formData.append("announcementId", announcementId.toString());
        xhr.open("POST", `${config.public.API_URL}/announcements/upload`);
        xhr.send(formData);
        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.response);
            if (res?.success) {
              const index = photos.value.findIndex(
                (el) => el.file.name === photo.name,
              );
              if (index === -1) return;
              photos.value[index].progress = 100;
              photos.value[index].loaded = true;
              resolve({ success: true });
            } else {
              const index = photos.value.findIndex(
                (el) => el.file.name === photo.name,
              );
              if (index === -1) return;
              photos.value[index].progress = 0;
              photos.value[index].loaded = false;
              reject({ success: false });
            }
          } catch (e) {
            console.log(e);
            reject({ success: false });
          }
        };

        xhr.onerror = () => {
          reject({ success: false });
        };
      });
    };

    const addPhoto = (photo: { file: File; url: string }) => {
      photos.value.push({ ...photo, progress: 0, loaded: false });
    };
    const deletePhoto = (name: string) => {
      photos.value = photos.value.filter((el) => el.file.name != name);
    };

    return {
      showCreateAnnouncementModal,
      uploadPhoto,
      addPhoto,
      setCreatedAnnouncement,
      deletePhoto,
      createdAnnouncement,
      clearPhotos,
      photos,
      hideCreateAnnouncementModal,
      createAnnouncementModalIsOpen,
      createAnnouncement,
    };
  },
);
