<script setup lang="ts">
import EmailIcon from "@/shared/ui/Icons/EmailIcon.vue";
import RegisterInput from "@/shared/ui/Input/RegisterInput.vue";
import PasswordIcon from "@/shared/ui/Icons/PasswordIcon.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useAlertSlice } from "@/entities/alert";
import { useLoginFormSlice } from "../../model/slice/useLoginFormSlice";
import type { FetchError } from "ofetch";
import { AUTH_TOKEN } from "@/shared/const/constants";
import { useUserSlice } from "@/entities/user";
const { setAlert } = useAlertSlice();
const { login } = useLoginFormSlice();
const { setUser, fetchProfile } = useUserSlice();
const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .required("Электронная почта обязательна для заполнения")
      .email("Некорректная почта"),
    password: yup.string().required("Пароль обязателен для заполнения"),
  }),
});
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const authToken = ref<string | null>(null);

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await login({
      email: values.email,
      password: values.password,
    });
    const token = useCookie(AUTH_TOKEN, {
      maxAge: 60 * 60 * 24 * 2,
    });

    token.value = res.data.token;
    authToken.value = res.data.token;
    setAlert("Авторизация прошла успешно!");
  } catch (e) {
    if (e instanceof Error) {
      const error = e as FetchError;
      if (error.data?.code === 100) {
        setAlert("Ошибка при отправке данных на сервер", "error");
      }
      if (error.data?.code === 3) {
        setAlert("Неправильная почта или пароль", "error");
      }
    } else {
      setAlert("Ошибка сервера", "error");
    }
    console.log(e);
    return;
  }

  try {
    if (authToken.value) {
      const res = await fetchProfile(authToken.value);
      setUser(res.data);
      reloadNuxtApp();
    } else {
      setAlert("Ошибка при авторизации. Попробуйте позже...", "error");
    }
  } catch (e) {
    if (e instanceof Error) {
      const error = e as FetchError;
      if (error.data?.code === 3) {
        setAlert("Вы не авторизованы", "error");
      }
    } else {
      setAlert("Ошибка сервера", "error");
    }
    console.log(e);
  }
});
</script>

<template>
  <div class="flex flex-col max-w-[300px] w-full">
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
      <button
        class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
        @click.prevent="onSubmit"
      >
        Авторизация
      </button>
      <div class="flex flex-col gap-4">
        <p class="font-montserrat text-center">Ещё нет аккаунта?</p>
        <NuxtLink
          href="/register"
          class="font-montserrat flex justify-center font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
        >
          Зарегистрироваться
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
