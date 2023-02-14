import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("AuthStore", () => {
  const isAuthModal = ref(false);

  const toggleAuthModal = () => {
    isAuthModal.value = !isAuthModal.value;
  };

  return { isAuthModal, toggleAuthModal };
});
