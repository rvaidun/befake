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
  <h1 class="z-1">TEST</h1>
  <loginComponent v-if="!this.$store.state.loggedIn" />
  <postsComponent v-else />
</template>
