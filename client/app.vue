<script setup lang="ts">
// import { Alert, useAlertSlice } from "@/entities/alert";
// import { type User, useUserSlice } from "@/entities/user";
// import { AUTH_TOKEN } from "@/shared/const/constants";
// import type { ServerResponse } from "@/shared/types/serverResponse";
// import { FetchError } from "ofetch";
//
// const userSlice = useUserSlice();
// const { setAlert } = useAlertSlice();
// const token = useCookie(AUTH_TOKEN);
// const config = useRuntimeConfig();
//
// const user: Ref<User | null> = ref(null);
//
// await useAsyncData("userProfile", async () => {
//   if (!token.value) return null;
//
//   try {
//     const response = await $fetch<ServerResponse<User>>("/auth/profile", {
//       baseURL: import.meta.server ? config.SSR_API_URL : config.public.API_URL,
//       headers: { Authorization: `Bearer ${token.value}` },
//     });
//
//     if (response.data) {
//       user.value = response.data;
//       userSlice.setUser(response.data);
//     }
//   } catch (err) {
//     if (err instanceof FetchError && err?.data?.code === 3) {
//       setAlert("Сессия устарела. Авторизуйтесь, пожалуйста");
//       token.value = undefined;
//       navigateTo("/login");
//     }
//     return null;
//   }
// });

import { Alert, useAlertSlice } from "@/entities/alert";
import { type User, useUserSlice } from "@/entities/user";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { FetchError } from "ofetch";

const userSlice = useUserSlice();
const { setAlert } = useAlertSlice();
const token = useCookie(AUTH_TOKEN);
const config = useRuntimeConfig();

const user: Ref<User | null> = ref(null);

console.log(
  import.meta.server ? config.SSR_API_URL : config.public.API_URL,
  token.value ? { Authorization: `Bearer ${token.value}` } : {},
);

const {
  data: userData,
  error,
  status,
} = useFetch<ServerResponse<User>>("/auth/profile", {
  baseURL: "http://backend:3001/api",
  headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
});

// onError({ error: fetchError }) {
//   if (fetchError instanceof FetchError && fetchError?.data?.code === 3) {
//     setAlert("Сессия устарела. Авторизуйтесь, пожалуйста");
//     token.value = undefined;
//     navigateTo("/login");
//   }
// }

console.log(error.value?.data, userData.value, status.value);

// watch(userData, (value) => {
//   console.log(value);
// });

// Если данные пришли — обновляем реф и userSlice
// if (userData.value?.data) {
//   user.value = userData.value.data;
//   userSlice.setUser(userData.value.data);
// }
</script>

<template>
  <NuxtLayout :user="user">
    <NuxtPage :user="user" />
  </NuxtLayout>
  <Alert />
</template>
