<script setup lang="ts">
import { CreateAnnouncementModal } from "@/features/createAnnouncement";
import { Header } from "@/widgets/Header";
import { Alert, useAlertSlice } from "@/entities/alert";
import { type User, useUserSlice } from "@/entities/user";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ServerResponse } from "@/shared/types/serverResponse";
import { FetchError } from "ofetch";
import { useUser } from "@/composables/useUser";
const token = useCookie(AUTH_TOKEN);
const config = useRuntimeConfig();
const user = useUser();

const { data: userData, error } = await useAsyncData("userProfile", () =>
  $fetch<ServerResponse<User>>("/auth/profile", {
    baseURL: import.meta.server ? config.SSR_API_URL : config.public.API_URL,
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
  }),
);

if (userData.value?.data) {
  user.value = userData.value.data;
}

onMounted(() => {
  const { setAlert } = useAlertSlice();
  const userSlice = useUserSlice();
  if (error.value instanceof FetchError && error?.value.data?.code === 3) {
    setAlert("Сессия устарела. Авторизуйтесь, пожалуйста");
    token.value = undefined;
    navigateTo("/login");
  }
  if (userData.value?.data) {
    userSlice.setUser(userData.value.data);
  }
});
</script>

<template>
  <div>
    <Header :user="userData?.data" />
    <section class="min-h-[calc(100vh-200px)]">
      <slot :user="userData?.data" />
      <CreateAnnouncementModal />
      <Alert />
    </section>
    <footer class="h-[100px]" />
  </div>
</template>
