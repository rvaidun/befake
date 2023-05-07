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
    },
    prev() {
      this.curr === 0 ? (this.curr = this.length - 1) : this.curr--;
    },
  },
};
</script>
<template>
  <div class="overflow-hidden relative whitespace-nowrap">
    <div
      class="flex transition-transform ease-out duration-500 max-w-[526px]"
      :style="{ transform: `translateX(-${curr * 100}%)` }">
      <slot></slot>
    </div>
    <div class="absolute inset-0 flex items-center justify-between p-4">
      <button
        @click="prev"
        class="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <button
        @click="next"
        class="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white">
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>

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
