<script setup lang="ts">
import RegisterFormFirstStep from "../RegisterFormFirstStep/RegisterFormFirstStep.vue";

const progress = ref(0);
const secondStep = ref(false);
const onSecondStep = () => {
  progress.value = 33;
  secondStep.value = true;
};
</script>

<template>
  <div class="flex flex-col max-w-[300px] w-full">
    <div class="w-full h-[14px] border-2 mt-10 border-sky-500 rounded-full">
      <div
        class="h-full bg-sky-500 w-1/2 rounded-full transition-all max-w-full"
        :style="`width: ${progress}%`"
      />
    </div>
    <RegisterFormFirstStep v-if="!secondStep" @on-second-step="onSecondStep" />
    <div v-if="secondStep">Second step</div>
  </div>
</template>
