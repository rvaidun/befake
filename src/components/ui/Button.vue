<script>
export default {
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
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer flex m-1"
  >
    <span><slot></slot></span>
    <PulseLoader v-if="loading"></PulseLoader>
  </button>
</template>
