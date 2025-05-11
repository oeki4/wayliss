<script setup lang="ts">
import type { IAnnouncement } from "@/entities/announcement";
import { DateTime } from "luxon";

defineProps<{
  announcement: IAnnouncement;
}>();
defineEmits<{ (e: "onclick"): void }>();
</script>

<template>
  <div
    class="w-full sm:w-48/100 lg:w-32/100 xl:w-24/100 flex flex-col gap-3 cursor-pointer"
    @click="$emit('onclick')"
  >
    <div class="h-50 w-full bg-gray-200 rounded-lg animate-pulse" />
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
