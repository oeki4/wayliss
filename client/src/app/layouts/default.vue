<script setup lang="ts">
import { CreateAnnouncementModal } from "@/features/createAnnouncement";
import { Header } from "@/widgets/Header";
import { type User, useUserSlice } from "@/entities/user";
const userSlice = useUserSlice();

defineProps<{
  user: User | null;
}>();
</script>

<template>
  <div>
    <Header :user="userSlice.user || user" />
    <section class="min-h-[calc(100vh-200px)]">
      <slot :user="user" />
      <CreateAnnouncementModal />
    </section>
    <footer class="h-[100px]" />
  </div>
</template>
