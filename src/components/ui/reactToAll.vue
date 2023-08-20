<!-- create simple vue.js component -->
<script>
import PopupModal from "../posts/PopupModal.vue";
import MyButton from "../ui/Button.vue";
import UploadRealmoji from "../posts/uploadRealmoji.vue";
export default {
  name: "ReactToAll",
  components: {
    PopupModal,
    MyButton,
    UploadRealmoji,
  },
  data() {
    return {
      showPopup: false,
      popupTitle: "React to all posts",
      popupContent: "Are you sure you want to react to all posts?",
      file: null,
      imageurl: null,
      loading: false,
      image: {},
    };
  },
  methods: {
    closePopup() {
      this.showPopup = false;
    },
  },
};
</script>

<style scoped>
.text-rainbow {
  background-image: linear-gradient(
    to left,
    rgb(240, 130, 240),
    rgb(190, 112, 245),
    rgb(0, 195, 255),
    rgb(0, 255, 0),
    rgb(255, 255, 0),
    rgb(255, 165, 0),
    rgb(255, 79, 79)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<template>
  <span
    class="cursor-pointer text-rainbow sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
    @click="showPopup = true"
    >{{ popupTitle }}</span
  >
  <PopupModal v-if="showPopup" @close="closePopup">
    <template v-slot:body>
      <div class="flex items-center flex-col gap-2 text-black">
        <h3 class="font-bold">{{ popupTitle }}</h3>
        <p class="pb-10">{{ popupContent }}</p>
      </div>
      <UploadRealmoji />
    </template>
  </PopupModal>
</template>
