<script setup lang="ts">
import type { User } from "@/entities/user";
import type { ServerResponse } from "@/shared/types/serverResponse";
import type { IAnnouncement } from "@/entities/announcement";
import { AUTH_TOKEN } from "@/shared/const/constants";
import { useAlertSlice } from "@/entities/alert";
import EditableAnnouncement from "@/features/editAnnouncement/ui/EditableAnnouncement/EditableAnnouncement.vue";
import { ShowCreateAnnouncementModalButton } from "@/features/createAnnouncement";

const { setAlert } = useAlertSlice();

const props = defineProps<{
  user: User | null;
}>();
const announcements: Ref<IAnnouncement[] | null> = ref(null);

if (!props.user) navigateTo("/login");
const token = useCookie(AUTH_TOKEN);
const config = useRuntimeConfig();

const { data } = await useAsyncData("accountAnnouncements", async () => {
  try {
    const response = await $fetch<ServerResponse<IAnnouncement[]>>(
      "/announcements/account",
      {
        baseURL: import.meta.server
          ? config.SSR_API_URL
          : config.public.API_URL,
        headers: {
          authorization: `Bearer ${token.value}`,
        },
      },
    );

    return response.data;
  } catch {
    setAlert("Ошибка при загрузке ваших объявлений");
  }
});

if (data?.value) {
  announcements.value = data?.value;
}
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto">
    <div class="w-full flex justify-between mb-10">
      <h1 class="text-xl lg:text-3xl font-montserrat font-medium">
        Мои объявления
      </h1>
      <ShowCreateAnnouncementModalButton v-if="user" />
    </div>
    <div v-if="data?.length" class="w-full flex gap-4 gap-y-10 flex-wrap mb-10">
      <EditableAnnouncement
        v-for="item in data"
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
