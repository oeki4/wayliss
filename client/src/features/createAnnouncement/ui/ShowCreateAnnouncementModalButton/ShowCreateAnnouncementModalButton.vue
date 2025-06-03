<script setup lang="ts">
import { useCreateAnnouncementSlice } from "@/features/createAnnouncement/model/slice/useCreateAnnouncementSlice";
import OutlinedPlusIcon from "@/shared/ui/Icons/OutlinedPlusIcon.vue";

const { showCreateAnnouncementModal } = useCreateAnnouncementSlice();
</script>

<template>
  <button
    class="cursor-pointer bg-green-500 rounded-xl max-h-12 py-1 px-2 flex items-center hover:opacity-50 transition-all gap-2"
    @click="showCreateAnnouncementModal"
  >
    <span
      class="font-montserrat text-sm font-semibold hidden sm:block text-white"
      >Найти соседа</span
    >
    <OutlinedPlusIcon class="min-w-8 w-8 stroke-white" />
  </button>
</template>
