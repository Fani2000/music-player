<script setup>
const props = defineProps({ song: Object });
</script>
<template>
  <!-- Playlist -->
  <ol id="playlist">
    <li
      class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    >
      <div>
        <a href="#" class="font-bold block text-gray-600">{{
          song?.modified_name
        }}</a>
        <span class="text-gray-500 text-sm">Artist Name</span>
      </div>

      <div class="text-gray-600 text-lg">
        <span class="comments">
          <i class="fa fa-comments text-gray-600"></i>
          15
        </span>
      </div>
    </li>
  </ol>
</template>
