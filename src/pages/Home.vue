<script>
import loginComponent from "./Login.vue";
import postsComponent from "./Posts.vue";

export default {
  components: {
    loginComponent,
    postsComponent,
  },
};
</script>

<template>
  <p>TEST</p>
  <loginComponent v-if="!this.$store.state.loggedIn" />
  <postsComponent v-else />
</template>
