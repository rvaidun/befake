<script>
import * as d3 from "d3";
export default {
  mounted() {
    const width = 960;
    const height = 500;
    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g");
  },
};
</script>
<template>
  <span class="text-9xl text-white">Hello</span>
  <svg></svg>
</template>
