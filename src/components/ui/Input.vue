<script>
export default {
  props: {
  typeOfInput: String,
  modelValue: String,
  placeholder: String,
},
  emits: ["update:modelValue",'enterPressed'],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style scoped>

/* chrommium based browsers */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

</style>



<template>
  <input
    :type="typeOfInput"
    v-model="value"
    @keyup.enter="this.$emit('enterPressed')"
    :placeholder="placeholder"
    class="border border-gray-300 rounded-lg w-full p-2 text-black m-1" />
</template>
