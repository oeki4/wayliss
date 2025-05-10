import type { User } from "../types/user";
import type { ServerResponse } from "@/shared/types/serverResponse";

export const useUserSlice = defineStore("user", () => {
  const user: Ref<User | null> = ref(null);
  const setUser = (payload: User) => {
    user.value = payload;
  };

  const fetchProfile = (token: string) => {
    const config = useRuntimeConfig();

    return $fetch<ServerResponse<User>>("/auth/profile", {
      method: "GET",
      baseURL: config.public.API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return {
    fetchProfile,
    setUser,
    user,
  };
});
