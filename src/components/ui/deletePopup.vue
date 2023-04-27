<script>
import PopupModal from "../posts/PopupModal.vue";
import MyButton from "../ui/Button.vue";
export default {
  name: "deletePopup",
  components: {
    PopupModal,
    MyButton,
  },
  data() {
    return {
      showPopup: false,
      popupTitle: "Delete post",
      popupContent: "Are you sure you want to delete your post?",
      file: null,
      imageurl: null,
      loading: false,
      image: {},
      user: this.$store.state.user,
      postsLoaded: this.$store.state.posts,
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
  <div id='trashIconContainer'>
    <img id='trashIcon' class="cursor-pointer h-6 ml-20" @click="showPopup = true" src="../../assets/icons8-trash-can.svg"
      alt="trash" />
  </div>
  <PopupModal v-if="showPopup" @close="closePopup">
    <template v-slot:body>
      <div class="flex items-center flex-col gap-2 text-black">
        <h3 class="font-bold">{{ popupTitle }}</h3>
        <p class="pb-10">{{ popupContent }}</p>
      </div>
      <div class="flex items-center gap-3">
        <label>
          <div class="border-white w-24 h-24 rounded-[50%] border-2 cursor-pointer">
            <input type="file" style="display: none" name="image" @change="onFileChange" />
            <div v-if="!file">
              <img src="../../assets/add.svg" alt="plus" />
            </div>
            <div v-else class="cursor-pointer">
              <img :src="imageurl" class="w-24 rounded-[50%]" alt="realmoji to upload" />
            </div>
          </div>
        </label>

        <div>
          <MyButton @clickedd="this.$store.dispatch('deletePost')" :loading="loading">Yes, delete</MyButton>
        </div>
      </div>
    </template>
  </PopupModal>
</template>
