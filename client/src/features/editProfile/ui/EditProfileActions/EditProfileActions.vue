<script setup lang="ts">
import EditIcon from "@/shared/ui/Icons/EditIcon.vue";
import CancelIcon from "@/shared/ui/Icons/CancelIcon.vue";
import SaveIcon from "@/shared/ui/Icons/SaveIcon.vue";
import { useEditProfileSlice } from "../../model/slice/useEditProfileSlice";

const { editProfileEnabled } = storeToRefs(useEditProfileSlice());

const { setEditProfileEnabled, resetEditProfileForm, onSubmit } =
  useEditProfileSlice();
</script>

<template>
  <div class="flex gap-4">
    <button
      v-if="editProfileEnabled"
      class="bg-green-500 flex justify-center items-center gap-2 hover:opacity-50 cursor-pointer transition-all font-montserrat text-white font-bold py-3 px-3 rounded-lg"
      @click="onSubmit()"
    >
      <span class="hidden sm:block"> Сохранить </span>
      <SaveIcon class="w-5 sm:w-6 stroke-white fill-white stroke stroke-1" />
    </button>
    <button
      v-if="!editProfileEnabled"
      class="bg-blue-500 flex justify-center items-center gap-2 hover:opacity-50 cursor-pointer transition-all font-montserrat text-white font-bold py-3 px-3 rounded-lg"
      @click="setEditProfileEnabled(true)"
    >
      <span class="hidden sm:block"> Редактировать </span>
      <EditIcon class="w-5 sm:w-6 stroke-white stroke stroke-2" />
    </button>
    <button
      v-if="editProfileEnabled"
      class="bg-red-600 flex justify-center items-center gap-2 hover:opacity-50 cursor-pointer transition-all font-montserrat text-white font-bold py-3 px-3 rounded-lg"
      @click="resetEditProfileForm()"
    >
      <span class="hidden sm:block"> Отменить </span>
      <CancelIcon class="w-5 sm:w-6 stroke-white fill-white stroke stroke-2" />
    </button>
  </div>
</template>
