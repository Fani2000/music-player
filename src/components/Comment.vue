<template>
  <li class="p-6 bg-gray-50 border border-gray-200">
    <!-- Comment Author -->
    <div class="mb-5">
      <div class="font-bold">{{ author }}</div>
      <time>{{ createdAt }}</time>
    </div>

    <p>
      {{ message }}
    </p>
  </li>
</template>

<script setup>
const props = defineProps({
  author: String,
  createdAt: String,
  message: String,
});
</script>
