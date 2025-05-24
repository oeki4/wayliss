<script setup lang="ts">
import type { IAnnouncement } from "@/entities/announcement";
import { Announcement, useAnnouncementSlice } from "@/entities/announcement";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { useAlertSlice } from "@/entities/alert";
const { setAlert } = useAlertSlice();
const { setAnnouncements } = useAnnouncementSlice();
const config = useRuntimeConfig();

const { data, error } = await useFetch<ServerResponse<IAnnouncement[]>>(
  "/announcements/last",
  {
    baseURL: config.public.API_URL,
  },
);

if (error.value?.data?.code === 500) {
  setAlert("Непредвиденная ошибка сервера", "error");
}

if (data.value) {
  setAnnouncements(data.value.data);
}

useSeoMeta({
  title: `Wayliss - Объявления`,
  ogTitle: `Wayliss - Объявления`,
  description: `Wayliss - Объявления`,
  ogDescription: `Wayliss - Объявления`,
});
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto">
    <h1 class="text-3xl font-montserrat font-medium mb-10">
      Последние объявления
    </h1>
    <div
      v-if="data?.data && data.data?.length"
      class="w-full flex gap-4 gap-y-10 flex-wrap mb-10"
    >
      <Announcement
        v-for="item in data.data"
        :key="item.id"
        :announcement="item"
      />
    </div>
    <div class="flex justify-center">
      <button
        class="bg-blue-500 hover:bg-blue-600 cursor-pointer transition-all font-montserrat text-white font-bold py-4 px-8 rounded-lg"
      >
        Показать ещё
      </button>
    </div>
  </section>
</template>
