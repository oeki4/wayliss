<script setup lang="ts">
import GlassIcon from "@/shared/ui/Icons/GlassIcon.vue";
import UserIcon from "@/shared/ui/Icons/UserIcon.vue";
import type { User } from "@/entities/user";
import { ShowCreateAnnouncementModalButton } from "@/features/createAnnouncement";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { AUTH_TOKEN } from "@/shared/const/constants";

defineProps<{
  user: User | null;
}>();

const config = useRuntimeConfig();

const logout = () => {
  const token = useCookie(AUTH_TOKEN);
  token.value = null;
  reloadNuxtApp();
};
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
        <Menu v-if="user" as="div" class="relative inline-block text-center">
          <MenuButton>
            <NuxtImg
              class="rounded-full w-10 min-w-10 h-10 cursor-pointer"
              alt="avatar"
              :src="`${config.public.API_URL}/users/${user.sub}/avatar`"
          /></MenuButton>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-out"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute flex flex-col gap-1.5 whitespace-nowrap -right-7/5 mt-2 bg-gray-100 px-3 py-3 rounded-lg shadow-lg"
            >
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  :class="{ underline: active }"
                  class="font-montserrat text-sm"
                  href="/account/announcements"
                >
                  Мои объявления
                </NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  :class="{ underline: active }"
                  class="font-montserrat text-sm"
                  href="/account/announcements"
                >
                  Настройки
                </NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="{ underline: active }"
                  class="font-montserrat cursor-pointer text-sm"
                  @click="logout"
                >
                  Выйти
                </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>

        <NuxtLink v-else href="/login">
          <UserIcon class="w-8 stroke-black cursor-pointer" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
