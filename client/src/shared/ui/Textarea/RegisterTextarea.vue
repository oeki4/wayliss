<script setup lang="ts">
const model = defineModel<string>();

const attrs = useAttrs();
</script>

<template>
  <textarea
    v-model="model"
    v-bind="attrs"
    class="border-2 min-h-[200px] text-gray-700 resize-none rounded-lg border-blue-500 px-2 py-2 focus:outline-0"
  />
</template>
