<script>
export default {
  data() {
    return {
      copy: JSON.stringify({
        token: localStorage.getItem("token") ?? "",
        refreshToken: localStorage.getItem("refreshToken") ?? "",
        expiration: localStorage.getItem("expiration") ?? "",
        phone: localStorage.getItem("phone") ?? "",
      }),
    };
  },
};
</script>
<template>
  <div class="bg-blue-300 flex py-2 dark:bg-blue-900 dark:text-white">
    <div class="mr-auto invisible"></div>
    <div class="mr-auto">
      <a class="sm:text-3xl font-bold">BeFake</a>
    </div>
    <a href="https://github.com/rvaidun/berealviewer" class="mr-3 fill-white">
      <img src="../assets/github-svgrepo-com.svg" class="fill-white" />
    </a>
    <button
      v-clipboard:copy="copy"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
    >
      Copy Credentials
    </button>
    <button
      @click="this.$store.commit('logout')"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
    >
      Logout
    </button>
  </div>
</template>
