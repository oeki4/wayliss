<script setup lang="ts">
import Modal from "@/shared/ui/Modal/Modal.vue";
import { useCreateAnnouncementSlice } from "../../model/slice/useCreateAnnouncementSlice";
import OutlinedInput from "@/shared/ui/Input/OutlinedInput.vue";
import CrossIcon from "@/shared/ui/Icons/CrossIcon.vue";
import OutlinedTextarea from "@/shared/ui/Textarea/OutlinedTextarea.vue";

const { createAnnouncementModalIsOpen: isOpen } = storeToRefs(
  useCreateAnnouncementSlice(),
);

const { hideCreateAnnouncementModal } = useCreateAnnouncementSlice();
</script>

<template>
  <Modal :is-open="isOpen" @on-close="hideCreateAnnouncementModal">
    <div
      class="bg-white relative flex flex-col gap-4 max-w-2xl w-full px-4 py-4 rounded-lg"
    >
      <button
        class="absolute top-1 cursor-pointer right-1"
        @click="hideCreateAnnouncementModal"
      >
        <CrossIcon
          class="fill-black hover:bg-black/10 rounded-lg transition-all w-8"
        />
      </button>
      <h1 class="text-xl font-montserrat font-medium">Создать объявление</h1>
      <form
        class="flex flex-col gap-3"
        @submit.prevent="console.log('Published!')"
      >
        <div class="flex flex-col gap-2">
          <label for="title" class="font-montserrat text-md"
            >Заголовок объявления</label
          >
          <OutlinedInput id="title" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="description" class="font-montserrat text-md"
            >Описание объявления</label
          >
          <OutlinedTextarea id="description" />
        </div>
        <button
          class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
        >
          Опубликовать
        </button>
      </form>
    </div>
  </Modal>
</template>
