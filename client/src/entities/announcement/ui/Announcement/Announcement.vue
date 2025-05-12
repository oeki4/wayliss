<script setup lang="ts">
import type { IAnnouncement } from "@/entities/announcement";
import { DateTime } from "luxon";
import { Carousel, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/carousel.css";
const config = useRuntimeConfig();

defineProps<{
  announcement: IAnnouncement;
}>();
defineEmits<{ (e: "onclick"): void }>();

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
};
</script>

<template>
  <div
    class="w-full sm:w-48/100 lg:w-32/100 xl:w-24/100 flex flex-col gap-3 cursor-pointer"
    @click="$emit('onclick')"
  >
    <Carousel
      v-if="announcement.AnnouncementPhoto.length > 1"
      class="z-10"
      v-bind="carouselConfig"
    >
      <Slide v-for="item in announcement.AnnouncementPhoto" :key="item.id">
        <img
          :src="`${config.public.STATIC_URL}/${item.name}`"
          alt="announcement photo"
          class="h-50 w-full rounded-lg"
        />
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>

    <img
      v-else-if="announcement.AnnouncementPhoto.length === 1"
      :src="`${config.public.STATIC_URL}/${announcement.AnnouncementPhoto[0].name}`"
      alt="announcement photo"
      class="h-50 w-full rounded-lg"
    />

    <div v-else class="h-50 w-full bg-gray-200 rounded-lg animate-pulse" />
    <div class="flex flex-col gap-2">
      <h5 class="font-montserrat font-semibold text-xl">
        {{ announcement.title }}
      </h5>
      <p class="line-clamp-4 leading-5">
        {{ announcement.description }}
      </p>
      <p class="text-sm text-right">
        {{
          DateTime.fromISO(announcement.createdAt).toFormat(
            "dd.LL.yyyy в HH:mm",
          )
        }}
      </p>
    </div>
  </div>
</template>
<style>
.carousel__pagination-button {
  border-radius: 100%;
  height: 10px;
  width: 10px;
  background-color: white;
}

.carousel__pagination-button--active {
  background-color: #9b9b9b;
}
</style>
