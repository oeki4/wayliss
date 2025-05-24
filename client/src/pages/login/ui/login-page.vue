<script setup lang="ts">
import { LoginForm } from "@/features/login";

useSeoMeta({
  title: `Wayliss - Авторизация`,
  ogTitle: `Wayliss - Авторизация`,
  description: `Wayliss - Авторизация`,
  ogDescription: `Wayliss - Авторизация`,
});
</script>

<template>
  <h1
    class="text-center mt-24 font-montserrat text-3xl font-semibold text-sky-600"
  >
    Авторизация
  </h1>
  <div class="w-full flex justify-center">
    <LoginForm />
  </div>
</template>
