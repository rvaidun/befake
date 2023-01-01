<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  components: {
    PulseLoader,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<template>
  <button
    @click="this.$emit('clickedd')"
    class="bg-white hover:bg-amber-100 text-black font-bold py-2 px-4 rounded flex m-1 items-center">
    <slot></slot>
    <PulseLoader v-if="loading" color="black"></PulseLoader>
  </button>
</template>
