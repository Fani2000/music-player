import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("AuthStore", () => {
  const isAuthModal = ref(false);
  const user = ref({})

  const toggleAuthModal = () => {
    isAuthModal.value = !isAuthModal.value;
  };

  const addUser = (_user) => {
    user.value = _user
  }

  return { isAuthModal, toggleAuthModal, addUser };
});
