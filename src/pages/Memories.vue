<script>
import { mapState } from "vuex";
import BeRealPhotos from "../components/ui/BeRealPhotos.vue";
export default {
  components: {
    BeRealPhotos,
  },
  data() {
    return {
      isfetch: true,
    };
  },
  beforeMount() {
    this.$store.dispatch("getMemories");
  },
  computed: {
    ...mapState({
      memories: (state) => state.memories,
    }),
  },
};
</script>
<template>
  <div>
    <p class="text-center text-2xl font-bold">Memories</p>
    <div v-for="m in memories" class="m-4 flex flex-col items-center">
      <p class="text-xl font-bold">{{ m.memoryDay }}</p>
      <BeRealPhotos :primary="m.primary.url" :secondary="m.secondary.url" />
    </div>
  </div>
</template>
