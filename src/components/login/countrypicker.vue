<script>
import countries from "../../data/countries.js";
export default {
  data() {
    return {
      countries: countries,
      selectedCountry: "+1",
    };
  },
  methods: {
    selectCountry(country) {
      this.selectedCountry = country;
    },
  },
};
</script>
<template>
  <select
    v-model="selectedCountry"
    @change="$emit('asdfasdf', selectedCountry)"
    class="border border-gray-300 rounded-lg w-full p-2 text-black m-1"
  >
    <option
      v-for="country in countries"
      :key="country.isoCode"
      :value="country.dialCode"
      class="border border-gray-300 rounded-lg w-full p-2 text-black m-1"
    >
      {{ country.dialCode }}
    </option>
  </select>
</template>
