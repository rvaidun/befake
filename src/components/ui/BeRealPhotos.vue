<script>
export default {
  data() {
    return {
      hideSecondaryPhoto: false,
      reverse: false,
    };
  },
  props: ["primary", "secondary"],
};
</script>
<template>
  <div class="relative top-0 left-0 justify-center">
    <img
      referrerpolicy="no-referrer"
      v-bind:src="reverse ? secondary : primary"
      class="relative top-0 left-0 rounded-md sm:w-[400px] w-[100%]"
      @click="hideSecondaryPhoto = !hideSecondaryPhoto"
      alt="postImage" />
    <img
      referrerpolicy="no-referrer"
      v-bind:src="reverse ? primary : secondary"
      class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
      @click="reverse = !reverse"
      v-if="!hideSecondaryPhoto"
      alt="postImage" />
  </div>
</template>
