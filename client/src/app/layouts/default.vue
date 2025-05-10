<script setup lang="ts">
import { type User, useUserSlice } from "@/entities/user";
import { useAlertSlice } from "@/entities/alert";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { CreateAnnouncementModal } from "@/features/createAnnouncement";
const userSlice = useUserSlice();
const { setAlert } = useAlertSlice();
const token = useCookie(AUTH_TOKEN);
const config = useRuntimeConfig();

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
    userSlice.setUser(data.value.data);
  }
}
</script>

<template>
  <section class="min-h-[calc(100vh-200px)]">
    <slot />
    <CreateAnnouncementModal />
  </section>
</template>
