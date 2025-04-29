<script setup lang="ts">
import RegisterTextarea from "@/shared/ui/Textarea/RegisterTextarea.vue";
import { Field, useForm } from "vee-validate";
import * as yup from "yup";
import { useRegisterFormSlice } from "@/features/register/model/slice/useRegisterFormSlice";

const { setThirdStepData } = useRegisterFormSlice();

const emit = defineEmits<{
  (e: "onFinishRegister"): void;
}>();

const { defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    description: yup.string().required("Описание обязательно для заполнения"),
  }),
});

const [description] = defineField("description");

const onSubmit = handleSubmit(async (values) => {
  setThirdStepData({
    description: values.description,
  });
  emit("onFinishRegister");
});
</script>

<template>
  <form class="w-full flex flex-col gap-4 mt-10" @submit.prevent="onSubmit">
    <p class="font-montserrat text-sky-800 leading-5">
      Расскажите немного о себе... Это повысит шансы найти кого-то на платформе
      :)
    </p>
    <Field v-slot="{ field }" v-model="description" name="description">
      <RegisterTextarea v-bind="field" />
    </Field>

    <button
      class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
      type="submit"
    >
      Далее
    </button>
  </form>
</template>
