<script setup lang="ts">
defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <input
    :placeholder="placeholder"
    class="border-b-2 py-1 w-full focus:outline-0"
    type="text"
  />
</template>
