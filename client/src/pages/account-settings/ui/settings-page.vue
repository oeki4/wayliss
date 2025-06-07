<script setup lang="ts">
import type { User } from "@/entities/user";
import CameraIcon from "@/shared/ui/Icons/CameraIcon.vue";
import { EditProfileActions, EditProfileForm } from "@/features/editProfile";
const config = useRuntimeConfig();

const props = defineProps<{
  user: User | null;
}>();

if (!props.user) navigateTo("/login");

useSeoMeta({
  title: `Wayliss - Настройки`,
  ogTitle: `Wayliss - Настройки`,
  description: `Wayliss - Настройки`,
  ogDescription: `Wayliss - Настройки`,
});
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto">
    <div class="w-full flex justify-between mb-6">
      <h1 class="text-2xl lg:text-3xl font-montserrat font-medium">
        Настройки
      </h1>
      <EditProfileActions />
    </div>
    <div class="mb-6 w-full sm:max-w-2xs flex justify-center sm:justify-start">
      <NuxtImg
        v-if="user?.avatar"
        width="200px"
        height="200px"
        class="rounded-full w-[150px] h-[150px] border-4 border-gray-300 shadow-lg sm:w-[200px] sm:h-[200px]"
        :src="`${config.public.API_URL}/users/${user.id}/avatar`"
        alt=""
      />
      <div v-else class="flex flex-col items-center">
        <label class="relative inline-block w-full mb-2.5">
          <input type="file" class="absolute -z-1 opacity-0 block w-0 h-0" />
          <span
            class="relative flex flex-col items-center justify-center group w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full border-dashed cursor-pointer outline-0 decoration-0 text-sm align-middle text-blue-500 hover:text-blue-600 font-montserrat font-semibold text-center border-3 hover:border-blue-600 border-blue-500 px-5 py-2.5 box-border m-0 transition-all"
          >
            <CameraIcon
              class="w-10 relative inline-block group-hover:stroke-blue-600 stroke-blue-500 transition-all"
            />
            Загрузите аватар
          </span>
        </label>
      </div>
    </div>
    <EditProfileForm :user="user" />
  </section>
</template>
