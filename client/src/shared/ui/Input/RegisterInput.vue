<script setup lang="ts">
defineProps<{
  error?: string;
}>();

const model = defineModel<string>();

const focused = ref(false);
const attrs = useAttrs();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex items-center border-b-2 gap-2 py-1 w-full border-sky-700 transition-all"
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
        v-model="model"
        class="py-1 w-full font-montserrat focus:placeholder:text-sky-500 placeholder:text-sky-700 text-sky-700 font-medium transition-all focus:outline-0"
        v-bind="attrs"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
    <p v-if="error" class="text-red-500 font-medium">{{ error }}</p>
  </div>
</template>
