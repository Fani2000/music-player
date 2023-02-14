import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VeeValidatePlugin from "./includes/validation";

import "./assets/css/main.css";

import { getAuth } from "firebase/auth";

let app;
const auth = getAuth();

auth.onAuthStateChanged((user) => {
  if (!app) {
    app = createApp(App);

    app.use(VeeValidatePlugin);
    app.use(createPinia());
    app.use(router);

    app.mount("#app");
  }
});
