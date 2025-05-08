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
      class="flex items-center border-2 rounded-lg px-2 py-2 gap-2 w-full transition-all border-gray-500"
      :class="{ '!border-blue-500': focused }"
    >
      <div
        v-if="$slots['left-icon']"
        class="fill-gray-500 stroke-gray-500 max-w-[24px] w-full transition-all"
        :class="{ '!fill-blue-500 !stroke-blue-500': focused }"
      >
        <slot name="left-icon" />
      </div>
      <input
        v-model="model"
        class="py-1 w-full font-montserrat placeholder:text-gray-500 font-medium transition-all focus:outline-0"
        v-bind="attrs"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
    <p v-if="error" class="text-red-500 font-medium">{{ error }}</p>
  </div>
</template>
