<script setup lang="ts">
import EditIcon from "@/shared/ui/Icons/EditIcon.vue";
import type { User } from "@/entities/user";
import CameraIcon from "@/shared/ui/Icons/CameraIcon.vue";
const config = useRuntimeConfig();

const props = defineProps<{
  user: User | null;
}>();

if (!props.user) navigateTo("/login");
</script>

<template>
  <section class="max-w-7xl px-4 xl:px-0 py-6 w-full m-auto">
    <div class="w-full flex justify-between mb-6">
      <h1 class="text-2xl lg:text-3xl font-montserrat font-medium">
        Настройки
      </h1>
      <button
        class="bg-blue-500 flex justify-center items-center gap-2 hover:bg-blue-600 cursor-pointer transition-all font-montserrat text-white font-bold py-3 px-3 rounded-lg"
      >
        <span class="hidden sm:block"> Редактировать </span>
        <EditIcon class="w-5 sm:w-6 stroke-white stroke stroke-2" />
      </button>
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
    <div class="flex gap-6 flex-wrap mb-6">
      <div class="flex w-full sm:max-w-2xs flex-col gap-2">
        <label for="firstName" class="font-montserrat">Ваше имя</label>
        <input
          id="firstName"
          disabled
          :value="user?.firstName"
          class="w-full font-montserrat placeholder:text-gray-500 font-medium transition-all border-2 border-gray-400 px-2 py-2 focus:outline-0 rounded-lg focus:border-blue-500"
        />
      </div>
      <div class="flex w-full sm:max-w-2xs flex-col gap-2">
        <label for="email" class="font-montserrat">Электронная почта</label>
        <input
          id="email"
          disabled
          :value="user?.email"
          class="w-full font-montserrat placeholder:text-gray-500 font-medium transition-all border-2 border-gray-400 px-2 py-2 focus:outline-0 rounded-lg focus:border-blue-500"
        />
      </div>
    </div>
    <div class="max-w-[600px] flex flex-col gap-2">
      <label for="description" class="font-montserrat">Ваше описание</label>
      <textarea
        id="description"
        disabled
        :value="user?.description"
        class="border-2 w-full min-h-[200px] font-montserrat text-gray-700 resize-none rounded-lg border-gray-400 px-2 py-2 focus:outline-0"
      />
    </div>
  </section>
</template>
