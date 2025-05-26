<script setup lang="ts">
import type { IAnnouncement } from "@/entities/announcement";
import { Announcement, useAnnouncementSlice } from "@/entities/announcement";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { useAlertSlice } from "@/entities/alert";
import { FetchError } from "ofetch";
const { setAlert } = useAlertSlice();
const { setAnnouncements } = useAnnouncementSlice();
const { announcements } = storeToRefs(useAnnouncementSlice());
const config = useRuntimeConfig();

const { data } = await useAsyncData("lastAnnouncements", async () => {
  try {
    const response = await $fetch<ServerResponse<IAnnouncement[]>>(
      "/announcements/last",
      {
        baseURL: import.meta.server
          ? config.SSR_API_URL
          : config.public.API_URL,
      },
    );
    return response.data;
  } catch (err) {
    if (err instanceof FetchError && err?.data?.code === 500) {
      setAlert("Непредвиденная ошибка сервера", "error");
    }
  }
});

if (data.value) {
  setAnnouncements(data.value);
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
      v-if="announcements.length"
      class="w-full flex gap-4 gap-y-10 flex-wrap mb-10"
    >
      <Announcement
        v-for="item in announcements"
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
