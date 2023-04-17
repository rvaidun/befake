<script>
import countries from "../../data/countries.js";
export default {
  data() {
    return {
      countries: countries,
      selectedCountry: this.$store.state.selectedCountry,
    };
  },
  methods: {
    selectCountry(value) {
      localStorage.setItem("previousCountry", value.dialCode);
      if (value === null) return;
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
      document.querySelectorAll(".flag_icon").forEach((e) => e.remove());
    },
  },
  async mounted() {
    // localStorage.setItem("previousCountry", "null");

    if (localStorage.getItem("previousCountry") !== "null") {
      console.log("running this");
      const index = this.countries.findIndex(
        (e) => e.dialCode === localStorage.getItem("previousCountry")
      );
      this.selectCountry(this.countries[index]);
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
    @option:selected="selectCountry"
    @open="rmFlag" />
</template>
