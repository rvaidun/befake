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
  <div class="bg-black rounded-lg shadow-md border border-white p-3 sm:w-[40%]">
    <div class="relative top-0 left-0 justify-center">
      <img
        loading="lazy"
        referrerpolicy="no-referrer"
        v-bind:src="reverse ? secondary : primary"
        class="relative top-0 left-0 rounded-md w-[100%]"
        @click="hideSecondaryPhoto = !hideSecondaryPhoto"
        alt="postImage" />
      <img
        loading="lazy"
        referrerpolicy="no-referrer"
        v-bind:src="reverse ? primary : secondary"
        class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
        @click="reverse = !reverse"
        v-if="!hideSecondaryPhoto"
        alt="postImage" />
    </div>
  </div>
</template>
