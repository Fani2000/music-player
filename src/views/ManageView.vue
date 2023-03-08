<script setup>
import Upload from "../components/Upload.vue";
import downloadIcon from "@/assets/download-solid.svg";
import { db, auth } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { ref, onMounted } from "vue";
import CompositionItem from "../components/CompositionItem.vue";
import { getSongs } from "../firebase/firebase";

const uploadRef = ref();
const songs = ref([]);
const docId = ref();

// onBeforeRouteLeave((to, from, next) => {
//   // uploadRef.value.cancelUploads()
//   console.log(uploadRef.value)
//   next()
// });

onMounted(async () => {
  // const query = await collection(db, 'songs')
  const _songs = await getSongs();
  songs.value = _songs;
  // try {
  //   const docRef = collection(db, "songs");

  //   console.log(docRef);

  //   const docSnap = await getDocs(docRef);

  //   docSnap.docs.forEach((doc) =>
  //     songs.value.push({ ...doc.data(), docId: doc.id })
  //   );

  //   console.log(songs.value);
  // } catch (e) {
  //   console.log(e);
  //   console.log("No Songs found!");
  // }
});

const handleRemoveSong = (songId) => {
  console.log(songId);
  songs.value = songs.value.filter((song) => song.docId !== songId);
};
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <Upload ref="uploadRef" />
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <img
              :src="downloadIcon"
              width="20"
              height="20"
              class="float-right text-green-400 text-2xl"
            />
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <template v-for="song in songs" :key="song.docId">
              <CompositionItem :song="song" @remove-song="handleRemoveSong" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
