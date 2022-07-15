<script>
import loginComponent from "./components/loginComponent.vue";
import postsComponentVue from "./components/postsComponent.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    loginComponent,
    postsComponentVue,
  },
  data() {
    return {
      loggedIn: localStorage.getItem("token") ? true : false,
    };
  },
  methods: {
    login() {
      this.loggedIn = true;
    },
    logout() {
      this.loggedIn = false;
    },
  },
});
</script>

<template class="">
  <div class="dark:bg-gray-900 dark:text-white">
    <loginComponent v-if="!loggedIn" :login="login" />
    <postsComponentVue v-else :logout="logout" />
  </div>
</template>
