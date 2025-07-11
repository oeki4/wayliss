<script setup lang="ts">
import { useCreateAnnouncementSlice } from "../../model/slice/useCreateAnnouncementSlice";
import OutlinedInput from "@/shared/ui/Input/OutlinedInput.vue";
import CrossIcon from "@/shared/ui/Icons/CrossIcon.vue";
import OutlinedTextarea from "@/shared/ui/Textarea/OutlinedTextarea.vue";
import { Field, useForm } from "vee-validate";
import * as yup from "yup";
import type { FetchError } from "ofetch";
import { useAlertSlice } from "@/entities/alert";
import CameraIcon from "@/shared/ui/Icons/CameraIcon.vue";
import CheckMarkIcon from "@/shared/ui/Icons/CheckMarkIcon.vue";
import { Dialog, DialogPanel, TransitionRoot } from "@headlessui/vue";

const { setAlert } = useAlertSlice();
const {
  createAnnouncementModalIsOpen: isOpen,
  photos,
  createdAnnouncement,
} = storeToRefs(useCreateAnnouncementSlice());

const {
  hideCreateAnnouncementModal,
  createAnnouncement,
  setCreatedAnnouncement,
  uploadPhoto,
  setCreateAnnouncementModal,
  addPhoto,
  deletePhoto,
  clearPhotos,
} = useCreateAnnouncementSlice();

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    title: yup.string().required("Заголовок обязателен для заполнения"),
    description: yup.string().required("Описание обязательно для заполнения"),
  }),
});
const [title, titleAttrs] = defineField("title");
const [description] = defineField("description");
const onSubmit = handleSubmit(async (values) => {
  try {
    // Объявление было создано, но не все фото загружены успешно
    if (createdAnnouncement.value) {
      for (const photo of photos.value) {
        if (!photo.loaded) {
          await uploadPhoto(photo.file, createdAnnouncement.value.id);
        }
      }
    } else {
      // Объявление ещё не создано
      const announcement = await createAnnouncement({
        description: values.description,
        title: values.title,
      });
      if (!announcement.data) {
        setAlert("Ошибка при создании объявления!", "error");
        return;
      }
      setCreatedAnnouncement(announcement.data);
      if (!createdAnnouncement.value) return;
      for (const photo of photos.value) {
        await uploadPhoto(photo.file, announcement.data.id);
      }
    }

    setAlert("Вы успешно создали объявление!");
    clearPhotos();
    resetForm();
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

const onAddPhoto = (e: Event) => {
  if (e?.target && (e.target as HTMLInputElement)?.files) {
    const files = (e.target as HTMLInputElement)?.files;
    if (!files?.[0]) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setAlert("Можно загружать только фото");
      return;
    }
    if (!(file.size <= 8 * 1024 * 1024)) {
      setAlert("Фото должно весить не более 8 Мб");
      return;
    }
    if (photos.value.find((el) => el.file.name === file.name)) {
      setAlert("Такое фото уже было загружено ранее");
      return;
    }
    const url = URL.createObjectURL(file);
    addPhoto({ file, url });
  }
};
</script>

<template>
  <TransitionRoot
    :show="isOpen"
    as="template"
    enter="transition-opacity duration-300"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity duration-100"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <Dialog class="relative z-50" @close="setCreateAnnouncementModal">
      <div class="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div
        class="fixed inset-0 flex w-screen sm:items-start md:items-center justify-center p-4 h-screen overflow-y-scroll"
      >
        <DialogPanel
          class="bg-white relative flex flex-col gap-4 max-w-2xl w-full px-4 py-4 rounded-lg h-fit"
        >
          <button
            class="absolute top-1 cursor-pointer right-1"
            @click="hideCreateAnnouncementModal"
          >
            <CrossIcon
              class="fill-black hover:bg-black/10 rounded-lg transition-all w-8"
            />
          </button>
          <h1 class="text-xl font-montserrat font-medium">
            Создать объявление
          </h1>
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
              <Field
                v-slot="{ field }"
                v-model="description"
                name="description"
              >
                <OutlinedTextarea v-bind="field" id="description" />
              </Field>
            </div>
            <p class="font-montserrat text-md">Изображения для объявления</p>
            <div
              class="w-full rounded-lg flex flex-wrap border-2 gap-2 border-gray-500 py-2 px-2"
            >
              <div
                v-for="item in photos"
                :key="item.file.lastModified"
                class="w-[150px] h-24 relative group"
              >
                <img
                  :src="item.url"
                  class="rounded-xl cursor-pointer hover:border-blue-600 border-blue-500 transition-all w-full h-full border-3"
                  alt="preview"
                />
                <div
                  class="py-1.5 bg-blue-500 absolute bottom-0 rounded-b-lg transition-all"
                  :style="[
                    `width: ${item.progress}%`,
                    `border-bottom-right-radius: ${item.progress > 95 ? '8px' : '0'}`,
                  ]"
                />
                <div
                  v-if="!(item.progress === 100)"
                  class="w-full h-full transition-all flex flex-col justify-center items-center group-hover:bg-gray-700/70 cursor-pointer absolute top-0 left-0 rounded-xl"
                  @click="deletePhoto(item.file.name)"
                >
                  <CrossIcon
                    class="group-hover:opacity-100 opacity-0 fill-gray-300 stroke-gray-300 rounded-lg transition-all w-10"
                  />
                  <p
                    class="group-hover:opacity-100 opacity-0 font-montserrat font-bold text-gray-300 transition-all"
                  >
                    Удалить
                  </p>
                </div>
                <div
                  v-if="item.progress === 100"
                  class="w-full h-full transition-all flex flex-col justify-center items-center bg-gray-700/70 cursor-pointer absolute top-0 left-0 rounded-xl"
                  @click="deletePhoto(item.file.name)"
                >
                  <CheckMarkIcon
                    class="fill-gray-300 rounded-lg transition-all w-10"
                  />
                  <p
                    class="font-montserrat font-bold text-gray-300 transition-all"
                  >
                    Загружено
                  </p>
                </div>
              </div>

              <div
                v-if="photos.length < 5"
                class="flex flex-col w-[150px] items-center"
              >
                <label class="relative h-24 inline-block w-full">
                  <input
                    type="file"
                    class="absolute -z-1 opacity-0 block w-0 h-0"
                    @change="onAddPhoto"
                  />
                  <span
                    class="relative h-full flex items-center justify-center group w-full border-dashed cursor-pointer outline-0 decoration-0 text-sm align-middle text-blue-500 hover:text-blue-600 font-montserrat font-semibold text-center rounded-xl border-3 hover:border-blue-600 border-blue-500 px-5 py-2.5 box-border m-0 transition-all"
                  >
                    <CameraIcon
                      class="w-10 relative inline-block group-hover:stroke-blue-600 stroke-blue-500 transition-all"
                    />
                  </span>
                </label>
              </div>
            </div>
            <button
              class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
              type="submit"
            >
              Опубликовать
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
