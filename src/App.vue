<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import AuthModal from "./components/AuthModal.vue";
import { onMounted } from "vue";
import { getAuth } from "@firebase/auth";
import { signout } from "./firebase/firebase";

const authStore = useAuthStore();

const { isLoggedIn, user } = storeToRefs(authStore);
const { toggleAuthModal, addUser, loginUser } = authStore;

const handleAuthModelOpen = () => {
  toggleAuthModal();
};

const handleLogOut = () => {
  signout();
  window.location.reload();
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
      <router-link class="text-white font-bold uppercase text-2xl mr-4" to="/" exact-active-class="no-active">
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-grow flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!isLoggedIn">
            <a @click="handleAuthModelOpen" class="px-2 text-white" href="#">
              Login / Register
            </a>
          </li>
          <template v-else>
            <li class="flex-1">
              <router-link to="/manage" class="px-2 text-white">
                Manage
              </router-link>
            </li>

            <li>
              <router-link to="/about" class="px-2 text-white" href="#">
                About
              </router-link>
            </li>

            <li class="cursor-pointer" @click="handleLogOut">
              <a class="px-2 text-white">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>

  <RouterView />
</template>
