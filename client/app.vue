<script setup lang="ts">
import { Alert } from "@/features/alert";
</script>

<template>
  <header class="h-[100px]">Header</header>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <footer class="h-[100px]">Footer</footer>
  <Alert />
</template>
