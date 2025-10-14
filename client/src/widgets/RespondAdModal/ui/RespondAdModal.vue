<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from "@headlessui/vue";
import OutlinedTextarea from "@/shared/ui/Textarea/OutlinedTextarea.vue";
import CrossIcon from "@/shared/ui/Icons/CrossIcon.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useRespondAdSlice } from "../model/slice/respondAdSlice";
import { useAlertSlice } from "@/entities/alert";

const { respondAdModalVisible } = storeToRefs(useRespondAdSlice());
const route = useRoute();
const { setAlert } = useAlertSlice();

const { setRespondAdModalVisible, createChat } = useRespondAdSlice();

const { errors, defineField, handleSubmit } = useForm({
  initialValues: {
    message: "",
  },
  validationSchema: yup.object({
    message: yup.string().required("Сообщение обязательно для заполнения"),
  }),
});

const onSubmit = handleSubmit(async (values) => {
  if (!route.params.id[0] || isNaN(+route.params.id[0])) {
    setAlert("Ошибка при отправке сообщения пользователю", "error");
    return;
  }
  const res = await createChat({
    announcementId: +route.params.id[0],
    message: values.message,
  });

  if (res.success) {
    setAlert(
      "Вы откликнулись на объявление. Для перехода в чат нажмите на иконку сверху справа",
    );
  }
});
const [message, messageAttrs] = defineField("message");
</script>

<template>
  <TransitionRoot
    :show="respondAdModalVisible"
    as="template"
    enter="transition-opacity duration-300"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity duration-100"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <Dialog class="relative z-50" @close="setRespondAdModalVisible(false)">
      <div class="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div
        class="fixed inset-0 flex w-screen sm:items-start md:items-center justify-center p-4 h-screen overflow-y-scroll"
      >
        <DialogPanel
          class="bg-white relative flex flex-col gap-4 max-w-2xl w-full px-4 py-4 rounded-lg h-fit"
        >
          <button
            class="absolute top-1 cursor-pointer right-1"
            @click="setRespondAdModalVisible(false)"
          >
            <CrossIcon
              class="fill-black hover:bg-black/10 rounded-lg transition-all w-8"
            />
          </button>
          <h1 class="text-xl font-montserrat font-medium">
            Редактировать объявление
          </h1>
          <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-2">
              <label for="description" class="font-montserrat text-md"
                >Сообщение для пользователя</label
              >
              <OutlinedTextarea
                v-bind="messageAttrs"
                id="description"
                v-model="message"
              />
            </div>
            <button
              class="font-montserrat font-semibold cursor-pointer bg-blue-500 hover:opacity-50 transition-all text-slate-200 py-3 rounded-lg"
              type="submit"
            >
              Отозваться
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
