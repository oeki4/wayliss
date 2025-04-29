<script setup lang="ts">
import { useForm } from "vee-validate";
import RegisterInput from "@/shared/ui/Input/RegisterInput.vue";
import Email from "@/shared/ui/Icons/Email.vue";

const { defineField } = useForm();

const progress = ref(10);

const [email, emailAttrs] = defineField("email");
</script>

<template>
  <div class="flex flex-col max-w-[300px] w-full">
    <div class="w-full h-[14px] border-1 mt-10 border-sky-500 rounded-full">
      <div
        class="h-full bg-sky-500 w-1/2 rounded-full transition-all max-w-full"
        :style="`width: ${progress}%`"
      />
    </div>
    <form class="w-full mt-10">
      <RegisterInput placeholder="Email">
        <template #left-icon> <Email /></template>
      </RegisterInput>
    </form>
    <button @click="progress += 10">Click me</button>
  </div>
</template>
