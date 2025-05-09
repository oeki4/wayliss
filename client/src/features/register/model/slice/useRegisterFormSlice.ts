import type { FirstStepData } from "../types/firstStep";
import type { SecondStepData } from "../types/secondStep";
import type { ThirdStepData } from "../types/thirdStep";
import type { ServerResponse } from "@/shared/types/serverResponse";

interface RegisterProps {
  email: string;
  firstName: string;
  password: string;
  age: number;
  description: string;
  avatar: File | null;
}

export const useRegisterFormSlice = defineStore("registerForm", () => {
  const config = useRuntimeConfig();
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

  const register = async ({
    email,
    firstName,
    password,
    age,
    description,
    avatar,
  }: RegisterProps) => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("age", age.toString());
    formData.append("description", description);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    return $fetch<
      ServerResponse<{
        id: number;
        firstName: string;
        email: string;
        avatar: string | null;
        age: number;
        description: string;
      }>
    >(`/users`, {
      method: "POST",
      baseURL: config.public.API_URL,
      body: formData,
    });
  };

  return {
    setFirstStepData,
    firstStepData,
    setSecondStepData,
    secondStepData,
    setThirdStepData,
    thirdStepData,
    register,
  };
});
