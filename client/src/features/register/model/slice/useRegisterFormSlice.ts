import type { FirstStepData } from "../types/firstStep";
import type { SecondStepData } from "../types/secondStep";
import type { ThirdStepData } from "../types/thirdStep";

export const useRegisterFormSlice = defineStore("registerForm", () => {
  const firstStepData: Ref<FirstStepData | null> = ref(null);
  const secondStepData: Ref<SecondStepData | null> = ref(null);
  const thirdStepData: Ref<ThirdStepData | null> = ref(null);
  const setFirstStepData = (data: FirstStepData) => {
    firstStepData.value = data;
  };
  const setSecondStepData = (data: SecondStepData) => {
    secondStepData.value = data;
  };

  const setThirdStepData = (data: ThirdStepData) => {
    thirdStepData.value = data;
  };
  return {
    setFirstStepData,
    firstStepData,
    setSecondStepData,
    secondStepData,
    setThirdStepData,
    thirdStepData,
  };
});
