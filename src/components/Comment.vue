<template>
  <li class="p-6 bg-gray-50 border border-gray-200">
    <!-- Comment Author -->
    <div class="mb-5">
      <div class="font-bold">{{ author }}</div>
      <time>{{ useTimeAgo(createdAt).value }}</time>
    </div>

    <p>
      {{ message }}
    </p>
  </li>
</template>

<script setup>
import { useTimeAgo } from "@vueuse/core";
defineProps({ author: String, createdAt: Date, message: String });
</script>
