<script setup lang="ts">
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

const { data } = await useAsyncData("userProfile", async () => {
  if (!token.value) return null;

  try {
    const response = await $fetch<ServerResponse<User>>("/auth/profile", {
      baseURL: import.meta.server ? config.SSR_API_URL : config.public.API_URL,
      headers: { Authorization: `Bearer ${token.value}` },
    });

    return response.data;
  } catch (err) {
    if (err instanceof FetchError && err?.data?.code === 3) {
      setAlert("Сессия устарела. Авторизуйтесь, пожалуйста");
      token.value = undefined;
      navigateTo("/login");
    }
    return null;
  }
});

if (data.value) {
  user.value = data.value;
  userSlice.setUser(data.value);
}
</script>

<template>
  <NuxtLayout :user="user">
    <NuxtPage :user="user" />
  </NuxtLayout>
  <Alert />
</template>
