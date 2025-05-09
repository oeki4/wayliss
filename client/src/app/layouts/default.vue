<script setup lang="ts">
import { AUTH_TOKEN } from "@/shared/const/constants";
import { useAlertSlice } from "@/entities/alert";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { type User, useUserSlice } from "@/entities/user";
const { setAlert } = useAlertSlice();
const { setUser } = useUserSlice();

const config = useRuntimeConfig();
const token = useCookie(AUTH_TOKEN);
if (token.value) {
  const { data, error } = useFetch<ServerResponse<User>>("/auth/profile", {
    baseURL: config.public.API_URL,
    headers: { Authorization: `Bearer ${token.value}` },
  });

  if (error.value?.data?.code === 3) {
    setAlert("Сессия устарела. Авторизуйтесь, пожалуйста");
    token.value = undefined;
    navigateTo("/login");
  }

  if (data.value) {
    setUser(data.value.data);
  }
}
</script>

<template>
  <section class="min-h-[calc(100vh-200px)]">
    <slot />
  </section>
</template>
