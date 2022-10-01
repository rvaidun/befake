<script>
import loginComponent from "../components/loginComponent.vue";
import postsComponentVue from "../components/postsComponent.vue";

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
    logout() {
      this.loggedIn = false;
    },
  },
};
</script>

<template>
  <loginComponent v-if="!loggedIn" :login="login" />
  <postsComponentVue v-else :logout="logout" />
</template>
