<script setup lang="ts">
import type { ServerResponse } from "@/shared/types/serverResponse";
import type { IAnnouncement } from "@/entities/announcement";
import { useAlertSlice } from "@/entities/alert";
import type { Profile } from "@/entities/profile";

const route = useRoute();
const config = useRuntimeConfig();
const { setAlert } = useAlertSlice();

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
};

if (!route.params.id) {
  navigateTo("/");
}

const announcement: Ref<(IAnnouncement & { User: Profile }) | null> = ref(null);

const { data } = await useAsyncData("announcementItem", async () => {
  try {
    const response = await $fetch<
      ServerResponse<IAnnouncement & { User: Profile }>
    >(`/announcements/${route.params.id}`, {
      baseURL: import.meta.server ? config.SSR_API_URL : config.public.API_URL,
    });

    if (!response.success || !response.data) {
      navigateTo("/");
      setAlert("Произошла ошибка при загрузке объявления");
    }

    return response.data;
  } catch {
    navigateTo("/");
    setAlert("Произошла ошибка при загрузке объявления");
    return;
  }
});
if (data.value) {
  announcement.value = data.value;

  useSeoMeta({
    title: `Wayliss | ${announcement.value.title.slice(0, 32)} ${announcement.value.title.length > 32 ? "..." : ""}`,
    ogTitle: `Wayliss | ${announcement.value.title.slice(0, 32)} ${announcement.value.title.length > 32 ? "..." : ""}`,
    description: announcement.value.description,
    ogDescription: announcement.value.description,
  });
}
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto announcement-page">
    <div class="flex w-full flex-col lg:flex-row gap-6 items-start mb-4">
      <Carousel
        v-if="
          data?.AnnouncementPhoto?.length && data?.AnnouncementPhoto?.length > 0
        "
        class="z-10 max-w-4xl w-full"
        v-bind="carouselConfig"
      >
        <Slide v-for="item in data.AnnouncementPhoto" :key="item.id">
          <NuxtImg
            :src="`${config.public.STATIC_URL}/${item.name}`"
            sizes="896px"
            alt="announcement photo"
            class="max-w-4xl h-auto max-h-70 sm:max-h-110 sm:h-full w-full rounded-lg"
          />
        </Slide>
        <template #addons>
          <Pagination />
          <Navigation />
        </template>
      </Carousel>
      <div
        v-else
        class="h-70 lg:h-110 max-w-4xl w-full bg-gray-200 rounded-lg"
      />
      <div
        class="flex lg:flex-col flex-wrap w-full lg:w-auto justify-between items-end lg:items-start gap-4"
      >
        <div class="flex flex-col gap-4">
          <h3 class="font-montserrat font-medium">Опубликовал:</h3>
          <div class="flex items-center gap-4">
            <NuxtImg
              width="60"
              height="60"
              class="rounded-full w-15 min-w-15 h-15"
              :src="`${config.public.API_URL}/users/${announcement?.User.id}/avatar`"
            />
            <p class="font-montserrat font-medium">
              {{ announcement?.User.firstName }}
            </p>
          </div>
        </div>

        <button
          class="bg-blue-500 hover:bg-blue-600 whitespace-nowrap cursor-pointer transition-all font-montserrat text-white font-bold py-4 px-4 rounded-lg"
        >
          Отозваться на объявление
        </button>
      </div>
    </div>
    <div class="flex max-w-4xl flex-col gap-4">
      <div class="flex w-full justify-between">
        <h1 class="text-xl lg:text-2xl font-montserrat font-medium">
          {{ data?.title }}
        </h1>
      </div>
      <p class="leading-6 text-sm font-montserrat lg:text-base">
        {{ data?.description }}
      </p>
    </div>
  </section>
</template>
<style>
.announcement-page .carousel__pagination-button {
  border-radius: 100%;
  opacity: 60%;
  height: 12px;
  width: 12px;
  background-color: white;
}

.announcement-page .carousel__pagination-button--active {
  background-color: #9b9b9b;
}

.announcement-page .carousel__next,
.carousel__prev {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
}

.announcement-page .carousel__next:hover,
.carousel__prev:hover {
  color: #b6b6b6;
  transition: all 0.3s;
}

.announcement-page .carousel__next {
  margin-right: 10px;
}

.announcement-page .carousel__prev {
  margin-left: 10px;
}

.announcement-page .carousel__next--disabled,
.carousel__prev--disabled {
  opacity: 0.3;
}
</style>
