<script setup lang="ts">
import { Alert } from "@/entities/alert";
import { Header } from "@/widgets/Header";
</script>

<template>
  <Header />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <footer class="h-[100px]">Footer</footer>
  <Alert />
</template>
