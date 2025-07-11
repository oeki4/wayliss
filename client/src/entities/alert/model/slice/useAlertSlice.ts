import { ref } from "vue";

export const useAlertSlice = defineStore("alert", () => {
  const text: Ref<string> = ref("");
  const status: Ref<"success" | "error"> = ref("success");
  const setAlert = (
    newText: string,
    newStatus: "success" | "error" = "success",
  ) => {
    text.value = newText;
    status.value = newStatus;

    setTimeout(() => {
      text.value = "";
    }, 3000);
  };
  return {
    text,
    setAlert,
    status,
  };
});
