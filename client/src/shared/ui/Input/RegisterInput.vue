<script setup lang="ts">
defineProps<{
  placeholder?: string;
}>();

const focused = ref(false);
</script>

<template>
  <div
    class="flex items-center border-b-2 gap-2 w-full border-sky-700 transition-all"
    :class="{ '!border-sky-500': focused }"
  >
    <div
      v-if="$slots['left-icon']"
      class="fill-sky-700 stroke-sky-700 max-w-[24px] w-full transition-all"
      :class="{ '!fill-sky-500 !stroke-sky-500': focused }"
    >
      <slot name="left-icon" />
    </div>
    <input
      :placeholder="placeholder"
      class="py-1 w-full font-montserrat focus:placeholder:text-sky-500 placeholder:text-sky-700 text-sky-700 font-medium transition-all focus:outline-0"
      type="text"
      @focus="focused = true"
      @blur="focused = false"
    />
  </div>
</template>
