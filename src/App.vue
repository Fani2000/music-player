<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import AuthModal from "./components/AuthModal.vue";
import { onMounted } from "vue";
import { getAuth } from "@firebase/auth";

const authStore = useAuthStore();

const { isLoggedIn, user } = storeToRefs(authStore);
const { toggleAuthModal, addUser, loginUser } = authStore;

const handleAuthModelOpen = () => {
  toggleAuthModal();
};

onMounted(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    addUser(user);
    loginUser();
  }
});
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-grow flex-row mt-1">
          <!-- Navigation Links -->
          <li v-show="!isLoggedIn">
            <a @click="handleAuthModelOpen" class="px-2 text-white" href="#"
              >Login / Register</a
            >
          </li>

          <li class="flex-1" v-show="isLoggedIn">
            <a class="px-2 text-white" href="#">Manage</a>
          </li>

          <li class="" v-show="isLoggedIn">
            <a class="px-2 text-white">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <RouterView />
</template>
