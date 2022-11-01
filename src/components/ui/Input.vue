<script>
export default {
  props: ["value", "placeholder"],
  data() {
    return {
      content: this.value,
    };
  },
  methods: {
    updateContent() {
      this.$emit("input", this.content);
    },
  },
};
</script>
<template>
  <input
    type="text"
    class="border border-gray-300 rounded-lg w-full p-2 text-black m-1"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>
