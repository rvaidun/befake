<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes bounce-in {
  0% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1.25);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
</style>
<script>
console.log("VITE PROXY URL", import.meta.env.VITE_PROXY_URL);
import errorToast from "./components/ui/errorToast.vue";
import NavbarVue from "./components/layout/Navbar.vue";
export default {
  components: {
    errorToast,
    NavbarVue,
  },
};
</script>

<template>
  <Transition name="bounce">
    <errorToast
      v-if="this.$store.state.error.show"
      :text="this.$store.state.error.text" />
  </Transition>
  <div class="bg-black text-white">
    <NavbarVue />
    <router-view class="mt-20 z-30" />
  </div>
</template>
