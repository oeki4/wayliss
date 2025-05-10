<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();
defineEmits<{
  (e: "onClose"): void;
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="w-full px-4 h-dvh bg-black/70 flex justify-center items-center fixed z-1"
        @click.self="$emit('onClose')"
      >
        <slot class="z-2" />
      </div>
    </Transition>
  </Teleport>
</template>
<style lang="css">
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
