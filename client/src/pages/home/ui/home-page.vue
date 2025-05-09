<script setup lang="ts">
import { Announcement } from "@/entities/announcement";
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto">
    <h1 class="text-3xl font-montserrat font-medium mb-10">
      Последние объявления
    </h1>
    <div class="w-full flex gap-4 gap-y-10 flex-wrap mb-10">
      <Announcement />
      <Announcement />
      <Announcement />
      <Announcement />
      <Announcement />
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
