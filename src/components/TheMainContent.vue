<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({ song: Object });
</script>
<template>
  <!-- Playlist -->
  <ol id="playlist">
    <li
      class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    >
      <div>
        <RouterLink
          :to="`/song/${song?.docId}`"
          class="font-bold block text-gray-600"
          >{{ song?.modified_name }}</RouterLink
        >
        <span class="text-gray-500 text-sm">Artist Name</span>
      </div>

      <div class="text-gray-600 text-lg">
        <RouterLink
          :to="{ path: `/song/${song?.docId}`, hash: '#comments' }"
          v-slot="{ navigate }"
        >
          <span class="comments" @click="navigate">
            <i class="fa fa-comments text-gray-600"></i>
            15
          </span>
        </RouterLink>
      </div>
    </li>
  </ol>
</template>
