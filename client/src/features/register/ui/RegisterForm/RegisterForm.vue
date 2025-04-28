<script setup lang="ts">
import { useForm } from "vee-validate";
import RegisterInput from "@/shared/ui/Input/RegisterInput.vue";

const { defineField } = useForm();

const [email, emailAttrs] = defineField("email");
</script>

<template>
  <form class="max-w-[200px] w-full">
    <RegisterInput placeholder="Email" />
  </form>
</template>
