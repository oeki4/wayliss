<script setup lang="ts">
import GlassIcon from "@/shared/ui/Icons/GlassIcon.vue";
import UserIcon from "@/shared/ui/Icons/UserIcon.vue";
import type { User } from "@/entities/user";
import { ShowCreateAnnouncementModalButton } from "@/features/createAnnouncement";

defineProps<{
  user: User | null;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <header class="max-w-7xl px-4 xl:px-0 py-6 r w-full m-auto">
    <div class="flex justify-between items-center w-full">
      <NuxtLink
        href="/"
        class="font-montserrat text-blue-500 hover:text-blue-600 transition-all font-semibold text-3xl"
      >
        Wayliss
      </NuxtLink>
      <div class="flex gap-4">
        <NuxtLink
          href="/"
          class="font-montserrat font-medium hover:text-blue-700 transition-all"
          >Объявления</NuxtLink
        >
        <NuxtLink
          href="/"
          class="font-montserrat font-medium hover:text-blue-700 transition-all"
          >Статьи</NuxtLink
        >
        <NuxtLink
          href="/"
          class="font-montserrat font-medium hover:text-blue-700 transition-all"
          >Контакты</NuxtLink
        >
        <NuxtLink
          href="/"
          class="font-montserrat font-medium hover:text-blue-700 transition-all"
          >О нас</NuxtLink
        >
      </div>
      <ShowCreateAnnouncementModalButton v-if="user" />
      <div class="flex w-min gap-4">
        <GlassIcon class="min-w-6 w-6 stroke-black cursor-pointer" />
        <NuxtImg
          v-if="user"
          class="rounded-full w-10 min-w-10 h-10 cursor-pointer"
          alt="avatar"
          :src="`${config.public.API_URL}/users/${user.sub}/avatar`"
        />
        <NuxtLink v-else href="/login">
          <UserIcon class="w-8 stroke-black cursor-pointer" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
