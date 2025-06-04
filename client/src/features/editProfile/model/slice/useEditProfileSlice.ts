import { useForm } from "vee-validate";
import * as yup from "yup";
import { type User, useUserSlice } from "@/entities/user";
import type { ServerResponse } from "@/shared/types/serverResponse";
import type { FetchError } from "ofetch";
import { useAlertSlice } from "@/entities/alert";
import { AUTH_TOKEN } from "@/shared/const/constants";

interface UpdateProfileProps {
  firstName: string;
  description: string;
}

export const useEditProfileSlice = defineStore("editProfile", () => {
  const editProfileEnabled = ref(false);
  const { user } = storeToRefs(useUserSlice());
  const { setAlert } = useAlertSlice();

  const setEditProfileEnabled = (payload: boolean) => {
    editProfileEnabled.value = payload;
  };

  const { errors, defineField, setFieldValue, resetForm, handleSubmit } =
    useForm({
      validationSchema: yup.object({
        firstName: yup.string().required("Имя обязательно для заполнения"),
        description: yup
          .string()
          .required("Описание обязательно для заполнения"),
      }),
    });

  const resetEditProfileForm = () => {
    setEditProfileEnabled(false);
    resetForm({
      values: {
        firstName: user.value?.firstName || "",
        description: user.value?.description || "",
      },
    });
  };

  const updateProfile = async ({
    firstName,
    description,
  }: UpdateProfileProps) => {
    const token = useCookie(AUTH_TOKEN);
    const config = useRuntimeConfig();
    return $fetch<ServerResponse<User>>("/users", {
      method: "PUT",
      baseURL: config.public.API_URL,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        firstName,
        description,
      }),
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await updateProfile({
        firstName: values.firstName,
        description: values.description,
      });

      if (res.data) {
        setAlert("Информация успешно обновлена!");
        editProfileEnabled.value = false;
      }
    } catch (e) {
      if (e instanceof Error) {
        const error = e as FetchError;
        if (error.data?.code === 500) {
          setAlert("Ошибка при отправке данных на сервер", "error");
        }
      } else {
        setAlert("Ошибка сервера", "error");
      }
      console.log(e);
      return;
    }
  });
  return {
    editProfileEnabled,
    setEditProfileEnabled,
    defineField,
    errors,
    setFieldValue,
    resetEditProfileForm,
    onSubmit,
  };
});
