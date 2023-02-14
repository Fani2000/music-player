import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VeeValidatePlugin from './includes/validation'

import "./assets/css/main.css";

const app = createApp(App);


app.use(VeeValidatePlugin)
app.use(createPinia());
app.use(router);

app.mount("#app");
