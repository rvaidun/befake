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
  <nav class="text-white mb-3">
    <div class="max-w-8xl py-2 sm:mx-8 mr-2">
      <div class="flex justify-between flex-col sm:flex-row">
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
        <a
          href="#"
          @click="hideNavbar = !hideNavbar"
          class="absolute top-[0.75rem] right-[1rem] sm:hidden flex flex-col justify-between w-[30px] h-[21px]">
          <span class="h-[3px] w-[100%] bg-white rounded-lg"></span>
          <span class="h-[3px] w-[100%] bg-white rounded-lg"></span>
          <span class="h-[3px] w-[100%] bg-white rounded-lg"></span>
        </a>
        <!-- links -->
        <div
          class="items-end space-x-2 flex flex-col sm:flex sm:flex-row p-[.5rem]"
          :class="{
            hidden: hideNavbar,
          }">
          <a
            href="https://github.com/rvaidun/berealviewer"
            class="cursor-pointer text-blue-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold">
            Github
          </a>

          <a
            class="cursor-pointer text-red-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            href="https://ko-fi.com/rahulvaidun">
            Donate
          </a>
          <a
            class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            href="/map">
            Map
          </a>
          <a
            class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            href="/about">
            About
          </a>
          <a
            class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            @click="this.$store.commit('logout')"
            v-if="this.$store.state.loggedIn">
            Logout
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
