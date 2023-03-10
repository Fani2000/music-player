<script setup>
import { onMounted, ref } from "vue";
import AuthModal from "../components/AuthModal.vue";
import TheIntroduction from "../components/TheIntroduction.vue";
import TheMainContent from "../components/TheMainContent.vue";
import ThePlayer from "../components/ThePlayer.vue";
import headphones from "@/assets/headphones.svg";
import { getSongs } from "../firebase/firebase";

const songs = ref([]);

const getSongsAndUpdateSongs = async (limit) => {
  const _songs = await getSongs(limit);
  console.log("SONGS", _songs);
  songs.value = _songs;
};

const handleScroll = (e) => {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;

  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    console.log("Request more data");
    getSongsAndUpdateSongs(2);
  }
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  getSongsAndUpdateSongs(1);
});
</script>

<template>
  <main>
    <AuthModal />
    <TheIntroduction />
    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Songs</span>
          <!-- <i
            class="fa-solid fa-headphones float-right text-green-400 text-xl"
          ></i> -->
          <img
            class="float-right ml-2 text-green-400"
            :src="headphones"
            width="24"
            height="24"
          />
          <i class="fa-solid fa-circle-play float-right text-xl"></i>
        </div>
        <template v-for="song in songs" :key="song.uid">
          <TheMainContent :song="song" />
        </template>
        <!-- .. end Playlist -->
      </div>
    </section>
    <ThePlayer :song="songs.value?.[0]" />
  </main>
</template>
