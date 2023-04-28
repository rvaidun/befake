<script>
import countries from "../../data/countries.js";
export default {
  data() {
    return {
      countries: countries,
      selectedCountry: undefined,
      oldCountry: null,
    };
  },
  methods: {
    selectCountry(value) {
      console.log(value);
      if (value == null) return;
      localStorage.setItem("previousCountry", value.isoCode);
      this.$emit("asdfasdf", value.dialCode);
      const papa = document.querySelector("div.vs__selected-options");
      const flag = document.createElement("img");
      flag.src = value.flag;
      flag.classList.add("w-auto");
      flag.classList.add("h-7");
      flag.classList.add("flag_icon");
      flag.classList.add("rounded");
      flag.classList.add("mr-2");
      flag.classList.add("border");
      flag.classList.add("border-gray-300");
      papa.insertBefore(flag, papa.firstChild);
    },
    rmFlag() {
      this.oldCountry = this.selectedCountry;
      document.querySelectorAll(".flag_icon").forEach((e) => e.remove());
      localStorage.setItem("previousCountry", null);
    },
    retriveCC() {
      if (this.oldCountry !== null) {
        this.selectCountry(this.oldCountry);
        this.selectedCountry = this.oldCountry;
      }
    },
  },
  mounted() {
    if (localStorage.getItem("previousCountry") !== "null") {
      const index = this.countries.findIndex(
        (e) => e.isoCode === localStorage.getItem("previousCountry")
      );
      this.selectCountry(this.countries[index]);
      this.selectedCountry = this.countries[index];
    }
  },
  emits: ["asdfasdf"],
};
</script>

<style>
@import "vue-select/dist/vue-select.css";
.vs__dropdown-toggle {
  border: none;
}
</style>

<template>
  <v-select
    placeholder="Choose your country"
    v-model="selectedCountry"
    :options="countries"
    class="bg-white border border-gray-300 rounded-lg w-full p-1 text-black max-w-sm"
    @open="rmFlag"
    @update:modelValue="rmFlag"
    @close="retriveCC" />
</template>
