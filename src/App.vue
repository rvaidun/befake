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
      fetch("https://berealviewer.herokuapp.com/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept-language": "en-US,en;q=0.9",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
        }),
      });
      localStorage.clear();
      this.loggedIn = false;
    },
  },
});
</script>

<template>
  <loginComponent v-if="!loggedIn" :login="login" />
  <postsComponentVue v-else :logout="logout" />
</template>
