<script>
import MyButton from "../ui/Button.vue";
export default {
  components: { MyButton },
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
<template>
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
    <MyButton v-clipboard:copy="copy">Copy Credentials</MyButton>
    <MyButton @clickedd="this.$store.commit('logout')"> Logout </MyButton>
  </div>
</template>
