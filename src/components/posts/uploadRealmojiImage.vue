<script>
export default {
  props: ["secondary"],
  data() {
    return {
      file: null,
      imageurl: null,
    };
  },
  methods: {
    onFileChange(e) {
      if (e.target.files[0].size > 1048576) {
        this.$store.commit("error", "File size too large. Max 1MB");
        // clear file input
        e.target.value = "";
        return;
      }
      if (e.target.files[0].size < 1024) {
        this.$store.commit("error", "File size too small. Min 1KB");
        // clear file input
        e.target.value = "";
        return;
      }
      this.file = e.target.files[0];
      this.imageurl = URL.createObjectURL(this.file);
    },
  },
};
</script>
<template>
  <div class="border-2 border-white w-[350px] h-[485px]">
    <input type="file" accept="image/*" @change="onFileChange" />
    <div>
      <img :src="imageurl" v-if="imageurl" alt="realmoji" />
    </div>
  </div>
</template>
