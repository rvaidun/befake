<template>
  <div class="flex items-center justify-center mt-[25%]">
    <span class="mr-2">Enter your phone number with country code and +: </span>
    <input
      type="text"
      placeholder="+11234567890"
      v-model="phone"
      class="border-black border-2"
    />
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      phone: "",
    };
  },
};
</script>
