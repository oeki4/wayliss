<script setup lang="ts">
import { RegisterForm } from "@/features/register";
import type { User } from "@/entities/user";

const props = defineProps<{
  user: User | null;
}>();

if (props.user) navigateTo("/");

useSeoMeta({
  title: `Wayliss - Регистрация`,
  ogTitle: `Wayliss - Регистрация`,
  description: `Wayliss - Регистрация`,
  ogDescription: `Wayliss - Регистрация`,
});
</script>

<template>
  <h1
    class="text-center mt-24 font-montserrat text-3xl font-semibold text-sky-600"
  >
    Регистрация
  </h1>
  <div class="w-full flex justify-center">
    <RegisterForm />
  </div>
</template>
