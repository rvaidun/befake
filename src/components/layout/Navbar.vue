<script>
import MyButton from "../ui/Button.vue";
// importing reacttoall.vue
import ReactToAll from "../ui/reactToAll.vue";
export default {
  components: { MyButton, ReactToAll },
  data() {
    return {
      copy: JSON.stringify({
        token: localStorage.getItem("token") ?? "",
        refreshToken: localStorage.getItem("refreshToken") ?? "",
        expiration: localStorage.getItem("expiration") ?? "",
        user_id: localStorage.getItem("user_id") ?? "",
        fbrefreshtoken: localStorage.getItem("fbrefreshtoken") ?? "",
        fbtoken: localStorage.getItem("fbtoken") ?? "",
      }),
      hideNavbar: true,
      showNav: false,
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
/* we will explain what these classes do next! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active,
.v-leave-from {
  transform: translateY(0%);
  transition: all 0.3s ease-in-out;
}

.slide-enter-from {
  transform: translateY(100%);
}
.slide-leave-to {
  transform: translateY(100%);
}
</style>

<template>
  <nav class="fixed top-0 w-full text-white bg-black mb-3 z-30">
    <div class="max-w-8xl py-2 sm:mx-8 mr-2">
      <div class="flex justify-between items-center flex-row">
        <div class="flex items-center">
          <!-- logo -->
          <router-link
            to="/"
            class="flex items-center cursor-pointer"
            v-clipboard:copy="copy">
            <img
              src="../../assets/favicon.svg"
              class="w-12 rounded-full object-cover mr-2"
              alt="logo" />
            <span class="text-3xl font-bold">BeFake</span>
          </router-link>
        </div>
        <div class="hidden md:flex items-center">
          <a
            href="https://github.com/rvaidun/befake"
            target="_blank"
            class="cursor-pointer text-blue-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold githublogo">
          </a>
          <a
            class="cursor-pointer text-red-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            href="https://ko-fi.com/rahulvaidun"
            target="_blank">
            Donate
          </a>

          <react-to-all v-if="this.$store.state.loggedIn" />

          <router-link
            class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            to="/map"
            @click="() => (showNav = false)">
            Map
          </router-link>
          <router-link
            class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            to="/about"
            @click="() => (showNav = false)">
            About
          </router-link>
          <router-link
            class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            to="/memories"
            @click="() => (showNav = false)">
            memories
          </router-link>
          <a
            class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
            @click="this.$store.commit('logout')"
            v-if="this.$store.state.loggedIn">
            Logout
          </a>
        </div>
        <a
          @click="showNav = true"
          class="md:hidden flex flex-col justify-between w-[24px] h-[18px]">
          <span class="h-[1px] w-[100%] bg-white rounded-lg"></span>
          <span class="h-[1px] w-[100%] bg-white rounded-lg"></span>
          <span class="h-[1px] w-[100%] bg-white rounded-lg"></span>
        </a>
        <!-- links -->
        <Transition name="fade">
          <div
            v-if="showNav"
            class="fixed inset-0 flex flex-col justify-end w-full gap-4 z-40 bg-[#000000b5]"
            @click="showNav = false"></div>
        </Transition>
        <Transition name="slide">
          <div
            v-if="showNav"
            @click="(e) => e.stopPropagation()"
            class="flex flex-col gap-4 bg-black p-8 w-full z-50 fixed bottom-0">
            <a
              href="https://github.com/rvaidun/befake"
              target="_blank"
              class="cursor-pointer text-blue-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold githublogo">
            </a>
            <a
              class="cursor-pointer text-red-500 sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
              href="https://ko-fi.com/rahulvaidun"
              target="_blank">
              Donate
            </a>

            <react-to-all v-if="this.$store.state.loggedIn" />

            <router-link
              class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
              to="/map"
              @click="() => (showNav = false)">
              Map
            </router-link>
            <router-link
              class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
              to="/about"
              @click="() => (showNav = false)">
              About
            </router-link>

            <router-link
              class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
              to="/memories"
              @click="() => (showNav = false)">
              Memoriues
            </router-link>
            <a
              class="cursor-pointer text-white sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
              @click="this.$store.commit('logout')"
              v-if="this.$store.state.loggedIn">
              Logout
            </a>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>
