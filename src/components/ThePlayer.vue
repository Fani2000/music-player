<script setup>
import { computed } from "vue";
import { usePlayerStore } from "../stores/player";
import circle from "@/assets/circle-solid.svg";

const playing = computed(() => usePlayerStore().playing);
const song = computed(() => usePlayerStore().current_song);
const seek = computed(() => usePlayerStore().seek);
const duration = computed(() => usePlayerStore().duration);
const playerProgress = computed(() => usePlayerStore().playerProgress);

const { toggleAudio } = usePlayerStore();
</script>

<template>
  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center" v-if="song.modified_name">
      <span class="song-title font-bold">{{ song?.modified_name }}</span> by
      <span class="song-artist">{{ song?.display_name ?? "Fani" }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="toggleAudio">
        <i
          v-if="!playing"
          class="fa-solid fa-circle-play text-gray-500 text-xl"
        ></i>
        <i v-else class="fa-solid fa-circle-pause text-gray-500 text-xl"></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ seek }}</div>
      <!-- Scrub Container  -->
      <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
        <!-- Player Ball -->
        <span
          class="absolute -top-1.5 -ml-2.5 text-gray-800 text-lg z-40"
          :style="{ left: playerProgress }"
        >
          <!-- <i class="fa-solid fa-circle text-black"></i> -->
          <img :src="circle" :width="18" :height="18" />
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>
