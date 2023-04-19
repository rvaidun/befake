<!-- CustomInput.vue -->
<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
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
  data() {
    return {
      id: null,
    };
  },
  mounted() {
    this.id = this._uid;
  },
};
</script>

<style scoped>
input[type="checkbox"] {
  opacity: 0;
  position: absolute;
}

input[type="checkbox"] + label > svg {
  display: inline-block;
  background: none;
  margin: -1px 4px 0 0;
  vertical-align: middle;
  cursor: pointer;
}

input[type="checkbox"] + label > svg > path.checkmark {
  fill: none;
}

input[type="checkbox"]:checked + label > svg > path.checkmark {
  fill: rgb(44, 187, 93);
  /* fill: rgb(0,0,0); */
}

.bkg {
  fill: rgb(0, 0, 0);
  /* fill: rgb(255, 255, 255); */
}

.stroker {
  fill: rgb(255, 255, 255);
}
</style>

<template>
  <input :id="id" type="checkbox" class="m-1 w-5 h-5" v-model="value" />
  <label :for="id" class="m-1 w-5 h-5">
    <svg
      class="w-5 h-5"
      viewBox="0 0 22 22"
      version="1.1"
      id="svg6"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg">
      <defs id="defs312" />
      <path
        id="pt0"
        class="stroker"
        d="M 4.4,0 A 4.4,4.4 0 0 0 0,4.4 V 17.6 A 4.4,4.4 0 0 0 4.4,22 H 17.6 A 4.4,4.4 0 0 0 22,17.6 V 4.4 A 4.4,4.4 0 0 0 17.6,0 Z" />
      <path
        class="bkg"
        fill-rule="evenodd"
        d="m 5,1 h 12 a 4,4 0 0 1 4,4 v 12 a 4,4 0 0 1 -4,4 H 5 A 4,4 0 0 1 1,17 V 5 A 4,4 0 0 1 5,1 Z"
        id="bkg" />
      <path
        d="M 9.0913131,13.767469 5.9748234,10.390643 C 5.031576,9.4473947 3.6204779,11.15656 4.5599523,12.096034 l 3.8295845,4.089921 a 0.99984227,0.99984227 0 0 0 1.4110983,0 L 17.459804,7.5193973 C 18.372867,6.5799229 16.91272,4.8292556 16.052478,5.814006 Z"
        class="checkmark"
        id="checkmark" />
    </svg>
  </label>
</template>
