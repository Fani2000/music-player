<template>
  <div>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        :style="`background-image: url(${songImage})`"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          @click.prevent="playSong(song)"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fa-solid fa-play-circle"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">
            {{
              song?.modified_name?.length > 30
                ? song?.modified_name.substring(0, 30).concat("...")
                : song?.modified_name
            }}
          </div>
          <div>{{ song?.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ comments?.length }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form
            v-show="isLoggedIn"
            @submit="addComment"
            :validation-schema="schema"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              :disabled="comment_in_submission"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <template v-for="comment in comments" :key="comment.docID">
        <Comment
          :author="comment?.name ?? 'Fani Keorapetse'"
          :created-at="useTimeAgo(new Date(comment?.createdAt)).value"
          :message="comment?.content"
        />
      </template>
    </ul>

    <ThePlayer />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import songImage from "@/assets/img/song-header.png";
import ThePlayer from "../components/ThePlayer.vue";
import Comment from "../components/Comment.vue";
import { useNow, useTimeAgo } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { getSong, addComment as _addComment, auth } from "@/firebase/firebase";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { getComments } from "../firebase/firebase";
import { usePlayerStore } from "@/stores/player";

const route = useRoute();
const id = route.params.id;
const { isLoggedIn } = storeToRefs(useAuthStore());
const { handlePlaySong } = usePlayerStore();

const comment_in_submission = ref(false),
  comment_show_alert = ref(false),
  comment_alert_variant = ref("bg-blue-500"),
  comment_alert_message = ref("Please wait! Your comment is being submitted.");

const sort = ref("1");
const comments = ref();
const song = ref({});

const schema = {
  comment: "required|min:3",
};

watch(sort, (newSort) => {
  if (newSort == "1") {
    comments.value = comments.value
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    comments.value = comments.value
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
});

const playSong = (song) => {
  handlePlaySong(song);
};

const addComment = async (data, context) => {
  comment_in_submission.value = true;
  comment_show_alert.value = true;
  comment_alert_message.value = "Please wait! Your comment is being submitted.";
  comment_alert_variant.value = "bg-blue-500";

  console.log(data);
  const comment = {
    content: data.comment,
    createdAt: useNow().value.toString(),
    sid: id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid,
  };

  const docCreated = await _addComment(comment);

  await _getComments(id);

  if (docCreated) {
    comment_in_submission.value = true;
    comment_show_alert.value = true;
    comment_alert_message.value = "Comment has been added successfully.";
    comment_alert_variant.value = "bg-green-500";
  } else {
    comment_in_submission.value = true;
    comment_show_alert.value = true;
    comment_alert_message.value =
      "Try again later! Couldn't save your comment.";
    comment_alert_variant.value = "bg-red-500";
  }

  context.resetForm();

  comment_in_submission.value = false;
  comment_show_alert.value = false;
};

const _getComments = async (id) => {
  const _comments = await getComments(id);
  comments.value = _comments;
};

onMounted(async () => {
  console.log(id);
  const _song = await getSong(id);
  if (Object.keys(_song).length > 0) song.value = _song;
  await _getComments(id);
});
</script>
