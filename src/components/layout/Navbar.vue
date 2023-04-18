<script>
import MyButton from "../ui/Button.vue";
// importing reacttoall.vue
import ReactToAll from "../ui/reactToAll.vue";
export default {
  components: { MyButton, ReactToAll},
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
<style scoped>
.githublogo::before {
  content: url("../../assets/github-logo.svg");
  display: inline-block;
  width: 40px;
}
</style>

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
              src="../../assets/favicon.svg"
              class="w-12 rounded-full object-cover mr-2"
              alt="logo" />
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
          class="items-center space-x-2 flex flex-col sm:flex sm:flex-row p-[.5rem]"
          :class="{
            hidden: hideNavbar,
          }">
          <a
            href="https://github.com/rvaidun/befake"
            class="cursor-pointer text-blue-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold githublogo">
          </a>
          <a
            class="cursor-pointer text-red-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            href="https://ko-fi.com/rahulvaidun">
            Donate
          </a>
          
          <react-to-all v-if="this.$store.state.loggedIn"/>

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
