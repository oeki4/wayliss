import type { IAnnouncement } from "@/entities/announcement";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { useAlertSlice } from "@/entities/alert";

interface LoadedFile {
  file: File | null;
  url: string;
  progress: number;
  loaded: boolean;
  id?: number;
}

export const useEditAnnouncementSlice = defineStore("editAnnouncement", () => {
  const config = useRuntimeConfig();
  const { setAlert } = useAlertSlice();
  const editAnnouncementModalIsOpen = ref(false);
  const editableAnnouncement: Ref<IAnnouncement | null> = ref(null);
  const photos: Ref<Array<LoadedFile>> = ref([]);

  const showEditAnnouncementModal = () => {
    editAnnouncementModalIsOpen.value = true;
  };

  const setEditableAnnouncement = (payload: IAnnouncement) => {
    editableAnnouncement.value = payload;

    for (const photo of payload.AnnouncementPhoto) {
      photos.value.push({
        file: null,
        id: photo.id,
        url: `${config.public.STATIC_URL}/${photo.name}`,
        progress: 100,
        loaded: true,
      });
    }
  };

  const hideEditAnnouncementModal = () => {
    editAnnouncementModalIsOpen.value = false;
    photos.value = [];
  };

  const setEditAnnouncementModal = (payload: boolean) => {
    editAnnouncementModalIsOpen.value = payload;
    if (!payload) {
      photos.value = [];
    }
  };

  const uploadPhoto = (photo: File, announcementId: number) => {
    const token = useCookie(AUTH_TOKEN);
    return new Promise<{ success: boolean }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = function (e) {
        const index = photos.value.findIndex((el) => {
          if (el?.file) {
            return el.file.name === photo.name;
          }
        });
        photos.value[index].progress = Math.round((e.loaded / e.total) * 100);
      };
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("announcementId", announcementId.toString());
      xhr.open("POST", `${config.public.API_URL}/announcements/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token.value}`);
      xhr.send(formData);
      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.response);
          if (res?.success) {
            const index = photos.value.findIndex((el) => {
              if (el?.file) {
                return el.file.name === photo.name;
              }
            });
            if (index === -1) return;
            photos.value[index].progress = 100;
            photos.value[index].loaded = true;
            photos.value[index].id = res.data.id;
            resolve({ success: true });
          } else {
            const index = photos.value.findIndex((el) => {
              if (el?.file) {
                return el.file.name === photo.name;
              }
            });
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

  const updateAnnouncement = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    if (editableAnnouncement.value?.id) {
      const token = useCookie(AUTH_TOKEN);
      const res = await $fetch<ServerResponse<IAnnouncement>>(
        "/announcements",
        {
          method: "PUT",
          baseURL: config.public.API_URL,
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          body: JSON.stringify({
            title,
            description,
            announcementId: editableAnnouncement.value.id,
          }),
        },
      );
      if (res.success) {
        setAlert("Объявление изменено успешно");
        hideEditAnnouncementModal();
      } else {
        setAlert("Непредвиденная ошибка сервера", "error");
      }
    } else {
      setAlert("Непредвиденная ошибка", "error");
    }
  };

  const addPhoto = (photo: { file: File; url: string }) => {
    photos.value.push({
      ...photo,
      progress: 0,
      loaded: false,
    });
  };
  const deletePhoto = async (photo: LoadedFile) => {
    if (photo.id) {
      const token = useCookie(AUTH_TOKEN);
      const res = await $fetch<ServerResponse<null>>("/announcements/photo", {
        method: "DELETE",
        baseURL: config.public.API_URL,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({
          announcementId: editableAnnouncement?.value?.id,
          photoId: photo?.id,
        }),
      });
      if (res.success) {
        photos.value = photos.value.filter((el) => el?.id != photo.id);
        setAlert("Фото удалено успешно");
      } else {
        setAlert("Ошибка при удалении фото", "error");
      }
    } else {
      setAlert("Ошибка при удалении фото", "error");
    }
  };

  return {
    showEditAnnouncementModal,
    uploadPhoto,
    addPhoto,
    setEditableAnnouncement,
    deletePhoto,
    editableAnnouncement,
    photos,
    hideEditAnnouncementModal,
    setEditAnnouncementModal,
    updateAnnouncement,
    editAnnouncementModalIsOpen,
  };
});
