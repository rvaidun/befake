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
      this.file = e.target.files[0];
      this.imageurl = URL.createObjectURL(this.file);
      console.log("secondary is ", this.secondary);
      this.$emit("upload", this.file, this.secondary);
    },
  },
};
</script>
<template>
  <div class="border-2 border-white w-[350px] h-[485px]">
    <input type="file" accept="image/*" @change="onFileChange" />
    <div>
      <img :src="imageurl" v-if="imageurl" alt="image uploaded" />
    </div>
  </div>
</template>
