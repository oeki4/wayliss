import type { ServerResponse } from "@/shared/types/serverResponse";

interface LoginProps {
  email: string;
  password: string;
}

export const useLoginFormSlice = defineStore("loginForm", () => {
  const config = useRuntimeConfig();

  const login = async ({ email, password }: LoginProps) => {
    return $fetch<
      ServerResponse<{
        token: string;
      }>
    >(`${config.public.API_URL}/auth`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  };

  return {
    login,
  };
});
