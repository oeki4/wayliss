<script setup lang="ts">
import RegisterInput from "@/shared/ui/Input/RegisterInput.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useRegisterFormSlice } from "../../model/slice/useRegisterFormSlice";

const { setSecondStepData } = useRegisterFormSlice();

const emit = defineEmits<{
  (e: "onThirdStep"): void;
}>();

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("Имя обязательно для заполнения"),
    age: yup.number().required("Возраст обязателен для заполнения"),
  }),
});

const [name, nameAttrs] = defineField("name");
const [age, ageAttrs] = defineField("age");

const onSubmit = handleSubmit(async (values) => {
  setSecondStepData({
    age: values.age,
    name: values.name,
  });
  emit("onThirdStep");
});
</script>

<template>
  <form class="w-full flex flex-col gap-6 mt-10">
    <RegisterInput
      v-model="name"
      :error="errors?.name"
      v-bind="nameAttrs"
      type="text"
      placeholder="Ваше имя"
    />
    <RegisterInput
      v-model="age"
      :error="errors?.age"
      v-bind="ageAttrs"
      type="text"
      placeholder="Ваш возраст"
    />
    <button
      class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
      @click.prevent="onSubmit"
    >
      Далее
    </button>
  </form>
</template>
