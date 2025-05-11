<script setup lang="ts">
import Modal from "@/shared/ui/Modal/Modal.vue";
import { useCreateAnnouncementSlice } from "../../model/slice/useCreateAnnouncementSlice";
import OutlinedInput from "@/shared/ui/Input/OutlinedInput.vue";
import CrossIcon from "@/shared/ui/Icons/CrossIcon.vue";
import OutlinedTextarea from "@/shared/ui/Textarea/OutlinedTextarea.vue";
import { Field, useForm } from "vee-validate";
import * as yup from "yup";
import type { FetchError } from "ofetch";
import { useAlertSlice } from "@/entities/alert";

const { setAlert } = useAlertSlice();
const { createAnnouncementModalIsOpen: isOpen } = storeToRefs(
  useCreateAnnouncementSlice(),
);

const { hideCreateAnnouncementModal, createAnnouncement } =
  useCreateAnnouncementSlice();

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    title: yup.string().required("Заголовок обязателен для заполнения"),
    description: yup.string().required("Описание обязательно для заполнения"),
  }),
});
const [title, titleAttrs] = defineField("title");
const [description] = defineField("description");
const onSubmit = handleSubmit(async (values) => {
  try {
    await createAnnouncement({
      description: values.description,
      title: values.title,
    });
    hideCreateAnnouncementModal();
    setAlert("Вы успешно создали объявление!");
  } catch (e) {
    if (e instanceof Error) {
      const error = e as FetchError;
      if (error.data?.code === 500) {
        setAlert("Непредвиденная ошибка сервера", "error");
      }
    } else {
      setAlert("Непредвиденная ошибка сервера", "error");
    }
    console.log(e);
  }
});
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
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
          <label for="title" class="font-montserrat text-md"
            >Заголовок объявления</label
          >
          <OutlinedInput
            v-bind="titleAttrs"
            id="title"
            v-model="title"
            :error="errors?.title"
            type="text"
            placeholder="Заголовок"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="description" class="font-montserrat text-md"
            >Описание объявления</label
          >
          <Field v-slot="{ field }" v-model="description" name="description">
            <OutlinedTextarea v-bind="field" id="description" />
          </Field>
        </div>
        <button
          class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
          type="submit"
        >
          Опубликовать
        </button>
      </form>
    </div>
  </Modal>
</template>
