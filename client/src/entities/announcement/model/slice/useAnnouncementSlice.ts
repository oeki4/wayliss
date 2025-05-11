import type { Announcement } from "../types/announcement";

export const useAnnouncementSlice = defineStore("announcement", () => {
  const announcements: Ref<Announcement[]> = ref([]);

  const setAnnouncements = (payload: Announcement[]) => {
    announcements.value = payload;
  };
  return {
    setAnnouncements,
  };
});
