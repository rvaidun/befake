<script>
// import { mapState } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

library.add(faChevronLeft, faChevronRight);

export default {
  components: {
    FontAwesomeIcon,
  },
  props: ["length"],
  data() {
    return {
      curr: 0,
    };
  },
  methods: {
    next() {
      this.curr === this.length - 1 ? (this.curr = 0) : this.curr++;
      const cp = this.$refs.carousel.children[this.curr];
      console.log(cp);
      if (cp.scrollIntoViewIfNeeded)
        cp.scrollIntoViewIfNeeded({ behavior: "smooth" });
      else if (cp.scrollIntoView) {
        cp.scrollIntoView({ behavior: "smooth" });
      }
    },
    prev() {
      this.curr === 0 ? (this.curr = this.length - 1) : this.curr--;
      const cp = this.$refs.carousel.children[this.curr];

      if (cp.scrollIntoViewIfNeeded)
        cp.scrollIntoViewIfNeeded({ behavior: "smooth" });
      else if (cp.scrollIntoView) {
        cp.scrollIntoView({ behavior: "smooth" });
      }
    },
    scrollHandler(e) {
      // massive shoutout to stackoverflow user klaas leussink for this solution
      // https://stackoverflow.com/questions/65952068/determine-if-a-snap-scroll-elements-snap-scrolling-event-is-complete
      var atSnappingPoint = e.target.scrollLeft % e.target.offsetWidth === 0;
      var timeOut = atSnappingPoint ? 0 : 150;

      console.log("here");
      clearTimeout(e.target.scrollTimeout);
      e.target.scrollTimeout = setTimeout(() => {
        if (!timeOut) {
          console.log("snapped");
          const index = e.target.scrollLeft / e.target.offsetWidth;
          this.curr = index;
          this.$emit("scroll", index);
        } else {
          console.log("user stopped scrolling");
        }
      }, timeOut);
    },
  },
};
</script>
<style>
.scrollbar-hide {
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
<template>
  <div class="relative w-[400px]">
    <div
      class="flex snap-x snap-mandatory overflow-x-scroll scroll-smooth scrollbar-hide"
      ref="carousel"
      @scroll="scrollHandler">
      <slot></slot>
    </div>
    <button
      @click="prev"
      class="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white absolute top-[50%] left-[1%]">
      <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </button>
    <button
      @click="next"
      class="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white absolute top-[50%] left-[95%]">
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </button>
    <div class="absolute bottom-4 right-0 left-0">
      <div class="flex items-center justify-center gap-2">
        <div
          class="transition-all w-3 h-3 bg-white rounded-full"
          v-for="(_, i) in length"
          :class="{ 'p-2': curr === i, 'bg-opacity-50': curr !== i }"></div>
      </div>
    </div>
  </div>
</template>
