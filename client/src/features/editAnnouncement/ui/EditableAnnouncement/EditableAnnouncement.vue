<script setup lang="ts">
import type { IAnnouncement } from "@/entities/announcement";
import { DateTime } from "luxon";
import EditIcon from "@/shared/ui/Icons/EditIcon.vue";
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
      announcement
      photo
      v-bind="carouselConfig"
    >
      <Slide v-for="item in announcement.AnnouncementPhoto" :key="item.id">
        <NuxtImg
          format="webp"
          :src="`${config.public.STATIC_URL}/${item.name}`"
          sizes="516px"
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
      sizes="516px"
      alt="announcement photo"
      class="h-50 w-full rounded-lg"
    />

    <div v-else class="h-50 w-full bg-gray-200 rounded-lg animate-pulse" />
    <NuxtLink
      :href="`/announcement/${announcement.id}`"
      class="flex flex-col gap-2"
    >
      <h5 class="font-montserrat h-14 font-semibold text-xl">
        {{ announcement.title }}
      </h5>
      <p class="line-clamp-4 h-20 leading-5">
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
    <button
      class="bg-blue-500 flex justify-center items-center gap-2 hover:bg-blue-600 cursor-pointer transition-all font-montserrat text-white font-bold py-3 rounded-lg"
    >
      Редактировать <EditIcon class="w-6 stroke-white stroke stroke-2" />
    </button>
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
