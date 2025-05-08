<script setup lang="ts">
import EmailIcon from "@/shared/ui/Icons/EmailIcon.vue";
import RegisterInput from "@/shared/ui/Input/RegisterInput.vue";
import PasswordIcon from "@/shared/ui/Icons/PasswordIcon.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useRegisterFormSlice } from "../../model/slice/useRegisterFormSlice";

const { setFirstStepData } = useRegisterFormSlice();
const emit = defineEmits<{
  (e: "onSetStep", newStep: number): void;
}>();

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .required("Электронная почта обязательна для заполнения")
      .email("Некорректная почта"),
    password: yup
      .string()
      .required("Пароль обязателен для заполнения")
      .min(6, "Минимальная длина пароля - 6 символов"),
    confirmPassword: yup
      .string()
      .required("Повтор пароля обязателен для заполнения")
      .oneOf([yup.ref("password"), null], "Пароли не совпадают"),
  }),
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const onSubmit = handleSubmit(async (values) => {
  setFirstStepData({
    email: values.email,
    password: values.password,
  });
  emit("onSetStep", 2);
});
</script>

<template>
  <form class="w-full flex flex-col gap-6 mt-10">
    <RegisterInput
      v-model="email"
      :error="errors?.email"
      v-bind="emailAttrs"
      type="text"
      placeholder="Электронная почта"
    >
      <template #left-icon> <EmailIcon /></template>
    </RegisterInput>
    <RegisterInput
      v-model="password"
      :error="errors?.password"
      v-bind="passwordAttrs"
      type="password"
      placeholder="Пароль"
    >
      <template #left-icon> <PasswordIcon /></template>
    </RegisterInput>
    <RegisterInput
      v-model="confirmPassword"
      :error="errors?.confirmPassword"
      v-bind="confirmPasswordAttrs"
      type="password"
      placeholder="Повтор пароля"
    >
      <template #left-icon> <PasswordIcon /></template>
    </RegisterInput>
    <button
      class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
      @click.prevent="onSubmit"
    >
      Далее
    </button>
  </form>
</template>
