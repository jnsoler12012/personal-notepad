<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center"
        style="background: linear-gradient(#8274C5, #5A4A9F);">
        <div class="column q-pa-lg">
          <div class="row">
            <q-card square class="shadow-24" style="width:300px;height:485px;">
              <q-card-section class="bg-deep-purple-7">
                <h4 class="text-h5 text-white q-my-md">Login Page Prolibu</h4>
                <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
                  <q-btn fab icon="add" color="purple-4" />
                </div>
              </q-card-section>

              <q-card-section>
                <q-form class="q-px-sm q-pt-xl" ref="loginForm" @submit.prevent="onSubmit">
                  <q-input square v-model="email" type="email" label="Email" clearable :rules="[validateEmail]">
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                  <q-input square v-model="password" type="password" label="Password" clearable
                    :rules="[validatePassword]">
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                </q-form>
              </q-card-section>


              <q-card-actions class="q-px-lg">
                <q-btn @click="onSubmit" type="submit" size="lg" color="purple-4" class="full-width text-white"
                  label="submit" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>

  </q-layout>

</template>

<script>
import useAuthStore from '../stores/auth/index.js'
import { ref } from "vue";
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default {
  methods: {
    validateEmail: value => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value) ? true : 'Must be a valid email address',

    validatePassword: value => !value ? 'Password is required' : value.length < 3 ? 'Must be at least 3 characters' : true,
  },
  setup() {
    const authStore = useAuthStore();
    const $q = useQuasar();

    const loginForm = ref(null);
    const email = ref(null);
    const password = ref(null);

    const router = useRouter();

    console.log('asdasdasdasd');
    console.log(loginForm);
    console.log(loginForm.value);

    const onSubmit = async (evt) => {
      evt.preventDefault();

      const isValid = await (async () => (loginForm.value ? loginForm.value.validate() : false))();

      console.log('asdaasdasdasdasdsadsdasdasdasd');
      console.log(loginForm.value.validate());
      console.log(loginForm.value.getValidationComponents()[1].validate());

      if (isValid) {
        console.log('Form submitted successfully');
        console.log(authStore);
        let state = await (async () => {
          return authStore.loginAction({ email: email.value, password: password.value })
        })();

        if (state !== true) {
          $q.notify({
            type: 'negative',
            message: `Login validation error! ${state}`,
            position: 'bottom-right',
            timeout: 2000,
          });
        } else {
          console.log(authStore);
          router.push({ name: 'Notes' });
          $q.notify({
            type: 'positive',
            message: 'Login success',
            position: 'bottom-right',
            timeout: 2000,
          });
        }

        console.log(state);

      } else {
        console.log('Form validation failed');
        $q.notify({
          type: 'negative',
          message: 'Login validation error!',
          position: 'bottom-right',
          timeout: 2000,
        });
      }
    }

    return {
      // Option 1: return the store directly and couple it in the template
      authStore,
      loginForm,
      email,
      password,
      errors: [],
      onSubmit
    };
  },

}
</script>

<style></style>
