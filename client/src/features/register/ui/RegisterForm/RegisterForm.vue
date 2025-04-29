<script setup lang="ts">
import RegisterFormFirstStep from "../RegisterFormFirstStep/RegisterFormFirstStep.vue";
import RegisterFormSecondStep from "../RegisterFormSecondStep/RegisterFormSecondStep.vue";
import RegisterFormThirdStep from "../RegisterFormThirdStep/RegisterFormThirdStep.vue";

const progress = ref(0);
const step = ref(1);
const onSecondStep = () => {
  progress.value = 33;
  step.value = 2;
};
const onThirdStep = () => {
  progress.value = 66;
  step.value = 3;
};

const onFinishRegister = () => {
  progress.value = 100;
};
</script>

<template>
  <div class="flex flex-col max-w-[300px] w-full">
    <h3
      class="uppercase w-full text-center text-xl text-sky-600 font-semibold mt-4 text-montserrat"
    >
      шаг {{ step }}
    </h3>
    <div class="w-full h-[14px] border-2 mt-2 border-sky-500 rounded-full">
      <div
        class="h-full bg-sky-500 w-1/2 rounded-full transition-all max-w-full"
        :style="`width: ${progress}%`"
      />
    </div>
    <RegisterFormFirstStep v-if="step === 1" @on-second-step="onSecondStep" />
    <RegisterFormSecondStep v-if="step === 2" @on-third-step="onThirdStep" />
    <RegisterFormThirdStep
      v-if="step === 3"
      @on-finish-register="onFinishRegister"
    />
  </div>
</template>
