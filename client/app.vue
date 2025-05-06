<script setup lang="ts">
import { Alert } from "@/features/alert";
import { Header } from "@/widgets/Header";
</script>

<template>
  <Header>Header</Header>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <footer class="h-[100px]">Footer</footer>
  <Alert />
</template>
