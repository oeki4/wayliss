<script setup lang="ts">
import type { User } from "@/entities/user";
import { useEditProfileSlice } from "../../model/slice/useEditProfileSlice";
const props = defineProps<{
  user: User | null;
}>();

const { editProfileEnabled, errors } = storeToRefs(useEditProfileSlice());
const { defineField, setFieldValue } = useEditProfileSlice();

const [firstName, firstNameAttrs] = defineField("firstName");
const [description, descriptionAttrs] = defineField("description");

setFieldValue("firstName", props.user?.firstName || "");
setFieldValue("description", props.user?.description);
</script>

<template>
  <div class="flex gap-6 flex-wrap mb-6">
    <div class="flex w-full sm:max-w-2xs flex-col gap-2">
      <label for="firstName" class="font-montserrat">Ваше имя</label>
      <input
        id="firstName"
        v-model="firstName"
        :disabled="!editProfileEnabled"
        v-bind="firstNameAttrs"
        class="w-full font-montserrat placeholder:text-gray-500 font-medium transition-all border-2 border-gray-400 px-2 py-2 focus:outline-0 rounded-lg focus:border-blue-500"
      />
      <p v-if="errors?.firstName" class="text-red-500 font-medium">
        {{ errors?.firstName }}
      </p>
    </div>
    <div class="flex w-full sm:max-w-2xs flex-col gap-2">
      <label for="email" class="font-montserrat">Электронная почта</label>
      <input
        id="email"
        :value="user?.email"
        disabled
        class="w-full font-montserrat placeholder:text-gray-500 font-medium transition-all border-2 border-gray-400 px-2 py-2 focus:outline-0 rounded-lg focus:border-blue-500"
      />
      <p v-if="errors?.email" class="text-red-500 font-medium">
        {{ errors?.email }}
      </p>
    </div>
  </div>
  <div class="max-w-[600px] flex flex-col gap-2">
    <label for="description" class="font-montserrat">Ваше описание</label>
    <textarea
      id="description"
      v-model="description"
      :disabled="!editProfileEnabled"
      v-bind="descriptionAttrs"
      class="border-2 w-full min-h-[200px] font-montserrat text-gray-700 resize-none rounded-lg border-gray-400 transition-all px-2 py-2 focus:outline-0 focus:border-blue-500"
    />
    <p v-if="errors?.description" class="text-red-500 font-medium">
      {{ errors?.description }}
    </p>
  </div>
</template>
