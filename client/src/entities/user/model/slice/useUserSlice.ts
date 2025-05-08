import type { User } from "../types/user";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ServerResponse } from "@/shared/types/serverResponse";

export const useUserSlice = defineStore("user", () => {
  const user: Ref<User | null> = ref(null);
  const setUser = (payload: User) => {
    user.value = payload;
  };

  const fetchProfile = () => {
    const token = useCookie(AUTH_TOKEN);
    const config = useRuntimeConfig();

    return $fetch<ServerResponse<User>>(
      `${config.public.API_URL}/auth/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );
  };
  return {
    fetchProfile,
    setUser,
    user,
  };
});
