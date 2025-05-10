export const useCreateAnnouncementSlice = defineStore(
  "createAnnouncement",
  () => {
    const createAnnouncementModalIsOpen = ref(false);

    const showCreateAnnouncementModal = () => {
      createAnnouncementModalIsOpen.value = true;
    };

    const hideCreateAnnouncementModal = () => {
      createAnnouncementModalIsOpen.value = false;
    };

    return {
      showCreateAnnouncementModal,
      hideCreateAnnouncementModal,
      createAnnouncementModalIsOpen,
    };
  },
);
