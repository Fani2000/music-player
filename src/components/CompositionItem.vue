<script setup>
import { doc, setDoc } from "@firebase/firestore";
import { ref } from "vue";
import { db, deleteSong } from "../firebase/firebase";

const props = defineProps({
  song: Object,
});
const emits = defineEmits({ removeSong: Function });

const showForm = ref(false);
const in_submission = ref(false);
const show_alert = ref(false);
const alert_variant = ref("bg-blue-500");
const alert_message = ref("Please wait! Updating song info.");

const schema = {
  modified_name: "required",
  genre: "alphaSpaces",
};

const handleEditForm = () => {
  showForm.value = !showForm.value;
};

const handleUpdateSongDetails = async (data) => {
  console.log("Songs", data);
  in_submission.value = false;
  show_alert.value = true;
  alert_variant.value = "bg-blue-500";
  alert_message.value = "Please wait! Updating song info.";

  try {
    const songsRef = doc(db, "songs", data.docId);
    await setDoc(songsRef, data);
  } catch (e) {
    in_submission.value = false;
    alert_variant.value = "bg-red-500";
    alert_message.value = "Something went wrong! Try again later.";
    console.log(e);
    return;
  }

  in_submission.value = false;
  alert_variant.value = "bg-green-500";
  alert_message.value = "Success";
};

const handleDelete = async () => {
  const _song = await deleteSong(props.song);
  console.log(_song);
  if (_song) emits("removeSong", _song.docId);
};
</script>
<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div>
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click="handleDelete"
      >
        <i class="fa-solid fa-plus rotate-45"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click="handleEditForm"
      >
        <i class="fa-regular fa-edit"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-show="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form
        :validation-schema="schema"
        @submit="handleUpdateSongDetails"
        :initial-values="song"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modified_name"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="genre"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          :disabled="is_submission"
          class="py-1.5 px-3 mr-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="is_submission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>
