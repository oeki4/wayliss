<script setup lang="ts">
import RegisterTextarea from "@/shared/ui/Textarea/RegisterTextarea.vue";
import { Field, useForm } from "vee-validate";
import * as yup from "yup";
import { useRegisterFormSlice } from "@/features/register/model/slice/useRegisterFormSlice";
import CameraIcon from "@/shared/ui/Icons/CameraIcon.vue";

const { setThirdStepData } = useRegisterFormSlice();

const emit = defineEmits<{
  (e: "onFinishRegister"): void;
  (e: "onSetStep", newStep: number): void;
}>();

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: yup.object({
    description: yup.string().required("Описание обязательно для заполнения"),
    avatar: yup
      .mixed()
      .test("is-image", "Для аватара необходимо изображение", (value) => {
        if (!value) return true;
        return value.type.startsWith("image/");
      })
      .test("file-size", "Максимальный размер аватара - 8MB", (value) => {
        if (!value) return true;
        return value.size <= 8 * 1024 * 1024;
      }),
  }),
});

const [description] = defineField("description");
const [avatar, avatarAttrs] = defineField("avatar");

const onSubmit = handleSubmit(async (values) => {
  setThirdStepData({
    description: values.description,
    avatar: values.avatar || null,
  });
  emit("onFinishRegister");
});

const avatarUrl = computed(() =>
  avatar.value &&
  avatar.value.type.startsWith("image/") &&
  avatar.value.size <= 2 * 1024 * 1024
    ? URL.createObjectURL(avatar.value)
    : null,
);
</script>

<template>
  <form class="w-full flex flex-col gap-4 mt-10" @submit.prevent="onSubmit">
    <Field v-slot="{ handleChange, handleBlur }" v-model="avatar" name="file">
      <div class="flex flex-col items-center">
        <label class="relative inline-block w-full mb-2.5">
          <input
            type="file"
            class="absolute -z-1 opacity-0 block w-0 h-0"
            v-bind="avatarAttrs"
            @change="handleChange"
            @blur="handleBlur"
          />
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            class="rounded-xl cursor-pointer hover:border-blue-600 border-blue-500 transition-all max-h-50 border-3 w-full"
            alt="preview"
          />
          <span
            v-else
            class="relative flex flex-col items-center group w-full h-min border-dashed cursor-pointer outline-0 decoration-0 text-sm align-middle text-blue-500 hover:text-blue-600 font-montserrat font-semibold text-center rounded-xl border-3 hover:border-blue-600 border-blue-500 px-5 py-2.5 box-border m-0 transition-all"
          >
            <CameraIcon
              class="w-10 relative inline-block group-hover:stroke-blue-600 stroke-blue-500 transition-all"
            />
            Загрузите аватар
          </span>
        </label>
        <p class="text-red-500 text-sm text-center">
          {{ errors?.avatar }}
        </p>
      </div>
    </Field>
    <p class="font-montserrat text-sky-800 leading-5">
      Расскажите немного о себе... Это повысит шансы найти кого-то на платформе
      :)
    </p>
    <Field v-slot="{ field }" v-model="description" name="description">
      <RegisterTextarea v-bind="field" />
    </Field>
    <div class="w-full flex gap-4">
      <button
        class="font-montserrat font-semibold cursor-pointer w-1/2 bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
        @click.prevent="$emit('onSetStep', 2)"
      >
        Назад
      </button>
      <button
        class="font-montserrat font-semibold cursor-pointer w-1/2 bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
        type="submit"
      >
        Далее
      </button>
    </div>
  </form>
</template>
