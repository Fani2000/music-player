<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const authStore = useAuthStore();

const tab = ref("login");
const { isAuthModal } = storeToRefs(authStore);

const { toggleAuthModal } = authStore;

const registerSchema = {
  name: "required|min:3|max:100|alphaSpaces",
  email: "required|email|min:10|max:100",
  age: "required|minVal:18|maxVal:100",
  password: "required|min:4",
  confirm_password: "required|confirmed:@password",
  country: "required|country_not_allowed:Antarctica",
  tos: "tos",
};

const loginSchema = {
  email: "required|email|min:10|max:100",
  password: "required|min:4",
};

const reg_in_submission = ref(false);
const reg_show_alert = ref(false);
const reg_alert_variant = ref("bg-blue-500");
const reg_alert_msg = ref("Please wait! Your account is being created.");

const log_in_submission = ref(false);
const log_show_alert = ref(false);
const log_alert_variant = ref("bg-blue-500");
const log_alert_msg = ref("Please wait! You are logging in.");

const handleLoginUser = (formData) => {
  console.log(formData);
  log_show_alert.value = true;
  log_in_submission.value = true;
  log_alert_variant.value = "bg-blue-500";
  log_alert_msg.value = "Please wait! Your account is being created.";


  log_alert_variant.value = "bg-green-500";
  log_alert_msg.value = "Success! You have successfully logged in.";
};

const handleRegisterUser = (formData) => {
  console.log(formData);
  reg_show_alert.value = true;
  reg_in_submission.value = true;
  reg_alert_variant.value = "bg-blue-500";
  reg_alert_msg.value = "Please wait! Your account is being created.";


  reg_alert_variant.value = "bg-green-500";
  reg_alert_msg.value = "Success! Your account has been created.";
};
</script>
<template>
  <!-- prettier-ignore -->
  <div :class="`fixed z-10 inset-0 overflow-y-auto ${!isAuthModal ? 'hidden' : ''}`" id="modal">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <div class="modal-close cursor-pointer z-50" @click="() => toggleAuthModal()">
              <i class="fa-solid fa-plus rotate-45 text-2xl"></i>
            </div>
          </div>

          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded cursor-pointer py-3 px-4 transition "
                :class="{
                    'hover:text-white text-white bg-blue-600': tab === 'login',
                    'hover:text-blue-600': tab === 'register',
                }"
                @click.prevent="tab = 'login'"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center">
              <a class="block rounded cursor-pointer py-3 px-4 transition" href="#"
                :class="{
                    'hover:text-white text-white bg-blue-600': tab === 'register',
                    'hover:text-blue-600': tab === 'login',
                }"
                @click.prevent="tab = 'register'"
                >Register</a
              >
            </li>
          </ul>

          <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="log_show_alert"
          :class="log_alert_variant"
          >
          {{ log_alert_msg }}
        </div>
          <!-- LOGIN FORM -->
          <vee-form v-show="tab === 'login'" @submit="handleLoginUser" :validation-schema="loginSchema">
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <vee-field
                type="email"
                name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email"
              />
              <error-message class="text-red-600" name="email" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <vee-field
                type="password"
                name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password"
              />
              <error-message class="text-red-600" name="password" />
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
              :disabled="log_in_submission"
            >
              Submit
            </button>
          </vee-form>

          <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="reg_show_alert"
          :class="reg_alert_variant"
          >
          {{ reg_alert_msg }}
        </div>

          <!-- REGISTRATION FORM -->
          <vee-form @submit="handleRegisterUser" v-show="tab === 'register'" :validation-schema="registerSchema">
            <div class="mb-3">
              <label class="inline-block mb-2">Name</label>
              <vee-field 
                type="text"
                name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name"
              />
              <error-message class="text-red-600" name="name" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Email</label>
              <vee-field
                type="email"
                name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email"
              />
              <error-message class="text-red-600" name="email" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Age</label>
              <vee-field
                type="number"
                name="age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              />
              <error-message class="text-red-600" name="age" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Password</label>
              <vee-field
              name="password"
                type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password"
              />
              <error-message class="text-red-600" name="password" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Confirm Password</label>
              <vee-field
                type="password"
                name="confirm_password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password"
              />
              <error-message class="text-red-600" name="confirm_password" />
            </div>
            <div class="mb-3">
              <label class="inline-block mb-2">Country</label>
              <vee-field as="select"
                name="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                >
                <option value="RSA">South Africa</option>
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
                <option value="Antarctica">Antarctica</option>
              </vee-field>
              <error-message class="text-red-600" name="country" />
            </div>
            <div class="mb-3 pl-6">
              <vee-field
                name="tos"
                value="1"
                type="checkbox"
                class="w-4 h-4 float-left -ml-6 mt-1 rounded"
              />
              <label class="inline-block">Accept terms of service</label>
            </div>
            <error-message class="text-red-600" name="tos" />
            <button
              type="submit"
              :disabled="reg_in_submission"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            >
              Submit
            </button>
          </vee-form>
        </div>
      </div>
    </div>
  </div>
</template>
