import { Form as VeeForm, Field as VeeField } from "vee-validate";

export default {
  install(app) {
    console.log("RUNNING THE VEE VALIDATE PLUGIN");
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
  },
};
