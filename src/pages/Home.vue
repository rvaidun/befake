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
  <div class="mb-20">
    <loginComponent v-if="!this.$store.state.loggedIn" />
    <postsComponent v-else />
  </div>
</template>
