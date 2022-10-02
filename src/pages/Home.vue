<script>
import loginComponent from "../components/loginComponent.vue";
import postsComponentVue from "../components/postsComponent.vue";

export default {
  components: {
    loginComponent,
    postsComponentVue,
  },
  data() {
    return {};
  },
  methods: {
    logout() {
      this.loggedIn = false;
    },
  },
};
</script>

<template>
  <loginComponent v-if="!this.$store.state.loggedIn" :login="login" />
  <postsComponentVue v-else :logout="logout" />
</template>
