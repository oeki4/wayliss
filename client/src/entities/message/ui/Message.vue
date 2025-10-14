<script setup lang="ts">
import { DateTime } from "luxon";

defineProps<{
  position: "right" | "left";
  avatar: string;
  message: string;
  date: string;
}>();
</script>

<template>
  <div
    class="px-3 py-2 w-fit bg-slate-300 rounded-lg flex items-center gap-2.5"
    :class="{ 'flex-row-reverse': position === 'right' }"
  >
    <NuxtImg
      :src="avatar"
      alt="avatar"
      class="min-w-8 min-h-8 border-2 border-slate-400 rounded-full"
      style="width: 32px; height: 32px"
      format="webp"
      quality="100"
      width="32"
      height="32"
      lazy
    />
    <div class="flex flex-col gap-1">
      <p
        class="text-slate-700 text-sm font-semibold font-montserrat h-full flex items-center"
      >
        {{ message }}
      </p>
      <p class="w-full text-end text-sm font-montserrat text-slate-500">
        {{ DateTime.fromISO(date).toFormat("HH:mm dd.LL.yy") }}
      </p>
    </div>
  </div>
</template>
