<script setup lang="ts">
import { Alert, useAlertSlice } from "@/entities/alert";
import { type User, useUserSlice } from "@/entities/user";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ServerResponse } from "@/shared/types/serverResponse";

const userSlice = useUserSlice();
const { setAlert } = useAlertSlice();
const token = useCookie(AUTH_TOKEN);
const config = useRuntimeConfig();

const user: Ref<User | null> = ref(null);

if (token.value) {
  const { data, error } = await useFetch<ServerResponse<User>>(
    "/auth/profile",
    {
      baseURL: config.public.API_URL,
      headers: { Authorization: `Bearer ${token.value}` },
    },
  );
  if (error.value?.data?.code === 3) {
    setAlert("Сессия устарела. Авторизуйтесь, пожалуйста");
    token.value = undefined;
    navigateTo("/login");
  }

  if (data.value) {
    user.value = data.value.data;
    userSlice.setUser(data.value.data);
  }
}
</script>

<template>
  <NuxtLayout :user="user">
    <NuxtPage :user="user" />
  </NuxtLayout>
  <Alert />
</template>
