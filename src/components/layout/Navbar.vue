<script>
import MyButton from "../ui/Button.vue";
import DiscordLogo from "../../assets/discord-logo.svg";
export default {
  components: { MyButton, DiscordLogo },
  data() {
    return {
      copy: JSON.stringify({
        token: localStorage.getItem("token") ?? "",
        refreshToken: localStorage.getItem("refreshToken") ?? "",
        expiration: localStorage.getItem("expiration") ?? "",
        phone: localStorage.getItem("phone") ?? "",
      }),
      hideNavbar: true,
    };
  },
};
</script>
<!-- <template>
  <div
    class="bg-blue-300 flex py-2 dark:bg-blue-900 dark:text-white items-center"
  >
    <div class="mr-auto invisible"></div>
    <div class="mr-auto">
      <a class="sm:text-3xl font-bold">BeFake</a>
    </div>
    <a href="https://github.com/rvaidun/berealviewer" class="mr-3 fill-white">
      <img src="../../assets/github-svgrepo-com.svg" class="fill-white" />
    </a>
    <MyButton >Copy Credentials</MyButton>
    <MyButton @clickedd="this.$store.commit('logout')"> Logout </MyButton>
  </div>
</template> -->
<template>
  <nav class="text-white">
    <div class="max-w-8xl py-2 sm:mx-8 mr-2">
      <div class="flex justify-between">
        <div>
          <!-- logo -->
          <a
            class="flex items-center cursor-pointer"
            v-clipboard:copy="copy"
            href="/">
            <img
              src="../../assets/favicon.ico"
              class="h-12 w-12 rounded-full object-cover mr-2" />
            <span class="text-3xl font-bold">BeFake</span>
          </a>
        </div>
        <!-- links -->
        <div class="flex items-center space-x-2">
          <!-- <div> -->
          <a
            class="cursor-pointer text-black bg-white py-2 px-3 rounded-md font-bold"
            href="https://ko-fi.com/rahulvaidun">
            Donate
          </a>
          <!-- <span class="absolute text-xs font-bold text-red-500 rounded-full"
              >NEW!</span
            > -->
          <!-- </div> -->

          <a
            class="cursor-pointer text-black bg-white py-2 px-3 rounded-md font-bold"
            href="/about">
            About
          </a>
          <!-- <a href="/about" class="font-bold">About</a> -->
          <a
            class="cursor-pointer text-black bg-white py-2 px-3 rounded-md font-bold"
            @click="this.$store.commit('logout')"
            v-if="this.$store.state.loggedIn">
            Logout
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
