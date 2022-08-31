<script>
import loginComponent from "./loginComponent.vue";
import postsComponentVue from "./postsComponent.vue";

export default {
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
      localStorage.clear();
      this.loggedIn = false;
    },
  },
};
</script>

<template>
  <loginComponent v-if="!loggedIn" :login="login" />
  <postsComponentVue v-else :logout="logout" />
</template>
