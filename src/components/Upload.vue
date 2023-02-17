<script setup>
import { ref, onUnmounted } from "vue";
import { uploadFile, storeUserRelatedSong } from "../firebase/firebase";
import spinner from "../assets/spinner.svg";
import compactDisc from "../assets/compact-disc-solid.svg";

const is_dragover = ref(false);
const uploadStatus = ref([]);

const upload = async (e) => {
  is_dragover.value = false;

  const files = e.dataTransfer
    ? [...e.dataTransfer.files]
    : [...e.target.files];

  files.forEach(async (file) => {
    if (file.type !== "audio/mpeg") {
      console.log("FAILED", file);
      return;
    }

    const snapshot = uploadFile(file);
    // prettier-ignore
    const uploadIndex = uploadStatus.value.push({
        // prettier-ignore
        current_progress: (snapshot.snapshot.bytesTransferred / snapshot.snapshot.totalBytes) * 1000,
        task: snapshot.snapshot.task,
        name: file.name,
        variant: 'bg-blue-400',
        icon: 'fa-solid fa-rotate fa-spin',
        text_class: ''
      }) - 1;

    // How much has been uploaded so far.....
    snapshot.on(
      "state_changed",
      (_snap) => {
        const progress = (_snap.bytesTransferred / _snap.totalBytes) * 100;
        uploadStatus.value[uploadIndex].current_progress = progress;
      },
      (error) => {
        uploadStatus.value[uploadIndex].variant = "bg-red-400";
        uploadStatus.value[uploadIndex].icon = "fa-solid fa-plus rotate-45";
        uploadStatus.value[uploadIndex].text_class = "text-red-400";
        console.log(error);
      },
      () => {
        // STORE DATA IN THE DB
        // const song = {

        // }
        storeUserRelatedSong(
          snapshot.snapshot.task.snapshot.ref.name,
          snapshot.snapshot.task.snapshot.ref
        );

        uploadStatus.value[uploadIndex].variant = "bg-green-400";
        uploadStatus.value[uploadIndex].icon = "fa-solid fa-circle-check";
        uploadStatus.value[uploadIndex].text_class = "text-green-400";
      }
    );
  });
};

onUnmounted(() => {
  cancelUploads()
});

const cancelUploads = () => {
  uploadStatus.value.forEach((upload) => {
    upload.task.cancel();
  });
};



</script>
<template>
  <div class="col-span-1">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <img
          width="20"
          height="20"
          :src="compactDisc"
          class="float-right text-green-400 text-2xl"
        />
      </div>
      <div class="p-6">
        <!-- Upload Dropbox -->
        <div
          class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="is_dragover = false"
          @dragover.prevent.stop="is_dragover = true"
          @dragenter.prevent.stop="is_dragover = true"
          @dragleave.prevent.stop="is_dragover = false"
          @drop.prevent.stop="upload"
        >
          <h3>Drop your file here!</h3>
        </div>
        <input type="file" multiple @change="upload" />
        <hr class="my-6" />
        <!-- Progess Bars -->
        <div class="mb-4" v-for="upload in uploadStatus" :key="upload.name">
          <!-- File Name -->
          <div class="font-bold text-sm" :class="upload.text_class">
            <img
              height="20"
              width="20"
              :src="spinner"
              alt="loading spinner"
              class="fa-spin"
              v-if="
                !upload.text_class.includes('red') &&
                !upload.text_class.includes('green')
              "
            />
            <i v-else :class="upload.icon"></i>
            {{ upload.name }}
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div
              class="transition-all progress-bar bg-blue-400"
              :class="upload.variant"
              :style="{ width: `${upload.current_progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
