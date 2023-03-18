<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
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

const handleLogOut = async () => {
  await signout();
  useRouter().replace("/");
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
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        to="/"
        exact-active-class="no-active"
      >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-grow flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!isLoggedIn" @click="handleAuthModelOpen">
            <a class="px-2 text-white" href="#"> Login / Register </a>
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

  <AuthModal />
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <main>
        <component :is="Component"></component>
      </main>
    </transition>
  </RouterView>
</template>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
