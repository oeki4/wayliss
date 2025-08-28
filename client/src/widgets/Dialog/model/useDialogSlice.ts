// import type { ServerResponse } from "@/shared/types/serverResponse";
// import type { IAnnouncement } from "@/entities/announcement";
// import { AUTH_TOKEN } from "@/shared/const/constants";
//
// export const useDialogSlice = defineStore("dialog", () => {
//   const config = useRuntimeConfig();
//
//   const login = async () => {
//     return $fetch<
//       ServerResponse<{
//         token: string;
//       }>
//     >("/auth", {
//       method: "POST",
//       baseURL: config.public.API_URL,
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     });
//   };
//
//   const fetchChats = () => {
//     console.log(1);
//   };
//
//   return {};
// });
