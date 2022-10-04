<script>
import loginComponent from "./Login.vue";
import postsComponent from "./Posts.vue";

export default {
  components: {
    loginComponent,
    postsComponent,
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
  <postsComponent v-else />
</template>
