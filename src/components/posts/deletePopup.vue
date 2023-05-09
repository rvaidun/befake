<script>
import PopupModal from "../posts/PopupModal.vue";
import MyButton from "../ui/Button.vue";
export default {
  name: "DeletePopup",
  components: {
    PopupModal,
    MyButton,
  },
  data() {
    return {
      showPopup: false,
      popupTitle: "Delete post?",
      popupContent: "Are you sure you want to delete your post?",
      loading: false,
    };
  },
  methods: {
    closePopup() {
      this.showPopup = false;
    },
    onFileChange(e) {
      console.log(e);
      this.file = e.target.files[0];
      this.imageurl = URL.createObjectURL(this.file);
    },
  },
};
</script>

<style scoped></style>

<template>
  <div id="trashIconContainer">
    <img
      id="trashIcon"
      class="cursor-pointer h-6 ml-20"
      @click="showPopup = true"
      src="../../assets/icons8-trash-can.svg"
      alt="trash" />
  </div>
  <PopupModal v-if="showPopup" @close="closePopup">
    <template v-slot:body>
      <div class="flex items-center flex-col gap-2 text-black">
        <h3 class="font-bold">{{ popupTitle }}</h3>
        <p class="pb-10">{{ popupContent }}</p>
      </div>

      <div>
        <MyButton
          @clickedd="this.$store.dispatch('deletePost')"
          :loading="loading"
          >Yes, delete</MyButton
        >
      </div>
    </template>
  </PopupModal>
</template>
