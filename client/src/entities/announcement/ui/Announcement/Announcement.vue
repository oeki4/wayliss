<script setup lang="ts">
import type { IAnnouncement } from "@/entities/announcement";
import { DateTime } from "luxon";
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
    class="w-full announcement sm:w-48/100 lg:w-32/100 xl:w-24/100 flex flex-col gap-3 cursor-pointer"
    @click="$emit('onclick')"
  >
    <Carousel
      v-if="announcement.AnnouncementPhoto.length > 1"
      class="z-10"
      v-bind="carouselConfig"
    >
      <Slide v-for="item in announcement.AnnouncementPhoto" :key="item.id">
        <NuxtImg
          format="webp"
          :src="`${config.public.STATIC_URL}/${item.name}`"
          sizes="600px"
          alt="announcement photo"
          class="h-50 w-full rounded-lg"
        />
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>

    <NuxtImg
      v-else-if="announcement.AnnouncementPhoto.length === 1"
      format="webp"
      :src="`${config.public.STATIC_URL}/${announcement.AnnouncementPhoto[0].name}`"
      sizes="600px"
      alt="announcement photo"
      class="h-50 w-full rounded-lg"
    />

    <div v-else class="h-50 w-full bg-gray-200 rounded-lg animate-pulse" />
    <NuxtLink
      :href="`/announcement/${announcement.id}`"
      class="flex flex-col gap-2"
    >
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
    </NuxtLink>
  </div>
</template>
<style>
.announcement .carousel__pagination-button {
  border-radius: 100%;
  opacity: 60%;
  height: 10px;
  width: 10px;
  background-color: white;
}

.announcement .carousel__pagination-button--active {
  background-color: #9b9b9b;
}
</style>
