<script setup lang="ts">
import { useUserSlice } from "@/entities/user";
import { DateTime } from "luxon";
const config = useRuntimeConfig();

const { user } = storeToRefs(useUserSlice());
</script>

<template>
  <div
    class="text-slate-200 max-h-[88px] flex px-3 py-2 cursor-pointer hover:bg-slate-300 transition-all gap-2.5 items-center"
  >
    <img
      :src="`${config.public.API_URL}/users/${user?.id}/avatar`"
      :alt="`${user?.firstName}`"
      class="min-w-15 w-15 min-h-15 h-15 border-slate-400 rounded-full border-3"
      style="width: 60px; height: 60px"
    />
    <div class="w-full flex flex-col">
      <div class="w-full flex items-center justify-between gap-2.5">
        <p class="mt-2 font-montserrat text-slate-700 font-semibold text-base">
          {{ user?.firstName }}
        </p>
        <p
          v-if="true"
          class="px-2 py-1 font-montserrat font-medium rounded-full bg-green-600"
        >
          123
        </p>
      </div>
      <div class="w-full max-w-full flex flex-col">
        <p
          class="text-sm max-w-[200px] w-full text-slate-500 font-montserrat font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis"
        >
          Привет
        </p>
        <p
          v-if="true"
          class="text-sm w-full text-end text-slate-500 font-montserrat f"
        >
          {{ DateTime.now().toFormat("HH:mm dd.LL.yy") }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
