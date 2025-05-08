<script setup lang="ts">
import { useAlertSlice } from "../../model/slice/useAlertSlice";

const alertStore = useAlertSlice();
const { text, status } = storeToRefs(alertStore);
const { setAlert } = alertStore;
</script>

<template>
  <Teleport to="body">
    <Transition name="alert">
      <div
        v-if="!!text"
        class="fixed w-[250px] cursor-pointer px-3 py-2 rounded-lg right-10 bottom-5"
        :class="[
          { 'bg-green-400': status === 'success' },
          { 'bg-red-400': status === 'error' },
        ]"
        @click="setAlert('')"
      >
        <p class="font-montserrat text-base font-medium text-white">
          {{ text }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>
<style lang="css">
.alert-enter-active,
.alert-leave-active {
  transition: opacity 0.3s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
}
</style>
