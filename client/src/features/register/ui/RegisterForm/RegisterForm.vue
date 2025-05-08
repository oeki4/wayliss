<script setup lang="ts">
import RegisterFormFirstStep from "../RegisterFormFirstStep/RegisterFormFirstStep.vue";
import RegisterFormSecondStep from "../RegisterFormSecondStep/RegisterFormSecondStep.vue";
import RegisterFormThirdStep from "../RegisterFormThirdStep/RegisterFormThirdStep.vue";
import { useRegisterFormSlice } from "../../model/slice/useRegisterFormSlice";
import { useAlertSlice } from "@/features/alert";
import type { FetchError } from "ofetch";

const { register } = useRegisterFormSlice();
const registerSlice = useRegisterFormSlice();
const { setAlert } = useAlertSlice();

const { firstStepData, secondStepData, thirdStepData } =
  storeToRefs(registerSlice);

const progress = ref(0);
const step = ref(1);
const onSetStep = (newStep: number) => {
  if (newStep === 1) {
    step.value = 1;
    progress.value = 0;
  }
  if (newStep === 2) {
    step.value = 2;
    progress.value = 33;
  }

  if (newStep === 3) {
    step.value = 3;
    progress.value = 66;
  }
};

const onFinishRegister = async () => {
  progress.value = 100;
  if (!firstStepData.value || !secondStepData.value || !thirdStepData.value) {
    return;
  }
  try {
    await register({
      avatar: thirdStepData.value?.avatar || null,
      password: firstStepData.value.password,
      age: secondStepData.value.age,
      description: thirdStepData.value.description,
      email: firstStepData.value.email,
      firstName: secondStepData.value.name,
    });
    setAlert("Регистрация прошла успешно!");
    await navigateTo("/login");
  } catch (e) {
    if (e instanceof Error) {
      const error = e as FetchError;
      if (error.data?.code === 100) {
        step.value = 1;
        progress.value = 0;
        setAlert("Ошибка при отправке данных на сервер", "error");
      }
      if (error.data?.code === 1) {
        setAlert("Загружен некорректный аватар", "error");
      }
      if (error.data?.code === 2) {
        step.value = 1;
        progress.value = 0;
        setAlert("Пользователь с такой почтой уже существует", "error");
      }
    } else {
      setAlert("Ошибка сервера", "error");
    }
    console.log(e);
  }
};
</script>

<template>
  <div class="flex flex-col max-w-[300px] w-full">
    <h3
      class="uppercase w-full text-center text-xl text-blue-500 font-semibold mt-4 text-montserrat"
    >
      шаг {{ step }}
    </h3>
    <div class="w-full h-[14px] border-2 mt-2 border-blue-500 rounded-full">
      <div
        class="h-full bg-blue-500 w-1/2 rounded-full transition-all max-w-full"
        :style="`width: ${progress}%`"
      />
    </div>
    <RegisterFormFirstStep v-show="step === 1" @on-set-step="onSetStep" />
    <RegisterFormSecondStep v-show="step === 2" @on-set-step="onSetStep" />
    <RegisterFormThirdStep
      v-show="step === 3"
      @on-set-step="onSetStep"
      @on-finish-register="onFinishRegister"
    />
  </div>
</template>
