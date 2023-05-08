<script>
import { defineComponent } from "vue";
import PopupModal from "./PopupModal.vue";
import DeletePopup from "./deletePopup.vue";
import MyButton from "../ui/Button.vue";
import MyInput from "../ui/Input.vue";
import UploadRealmoji from "./uploadRealmoji.vue";
import Realmoji from "./Realmoji.vue";
export default defineComponent({
  props: ["post", "user"],
  data() {
    return {
      iframesrc: this.post.location
        ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyDPvCQ4RXgvhbboTmKh2qLnfY50aJxcD0E&q=${this.post.location.latitude}, ${this.post.location.longitude}`
        : "",
      reverseGeo: "",
      revbgeo: "",
      showModal: false,
      comment: "",
      submitCommentLoading: false,
      hideSecondaryPhoto: false,
      isOwner: false,
      showEmojis: false,
    };
  },
  methods: {
    reverseImages() {
      const temp = this.post.primary.url;
      this.post.primary.url = this.post.secondary.url;
      this.post.secondary.url = temp;
    },
    postdate() {
      return new Date(this.post.creationDate).toLocaleString();
    },
    cleancomment(s) {
      s = s.replaceAll("<", "&lt;");
      return s.replace(
        /@\w+/g,
        "<span class='font-bold text-blue-200'>$&</span>"
      );
    },
    submitComment() {
      this.submitCommentLoading = true;
      Promise.all([]);
      fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/comments?postId=${this.post.id}&postUserId=${this.user.id}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: this.comment,
          }),
        }
      )
        .then(() => {
          this.comment = "";
          this.$store.dispatch("getPosts");
          this.submitCommentLoading = false;
        })
        .catch(() => {
          this.submitCommentLoading = false;
          this.comment = "";
          this.$store.commit(
            "error",
            "An error occured while submitting your comment. Please try again later."
          );
        });
    },
  },
  computed: {
    color() {
      let letters = "0123456789ABCDEF";
      let color = "";
      for (let i = 0; i < 6; i++) {
        color += letters[this.user.username.charCodeAt(i) % 16];
      }
      return color;
    },
  },
  async beforeMount() {
    if (this.post.location) {
      fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${this.post.location.longitude},${this.post.location.latitude}&langCode=fr&outSR=&forStorage=false&f=pjson`
      )
        .then((res) => res.json())
        .then((data) => {
          this.revbgeo = data;
          this.reverseGeo = data.address.City + ", " + data.address.CntryName;
        })
        .catch((err) => {
          console.log("error in reverse geocoding");
        });
    }
    if (this.$store.state.user.id === this.user.id) {
      this.isOwner = true;
    }
  },
  components: {
    PopupModal,
    MyButton,
    MyInput,
    UploadRealmoji,
    Realmoji,
    DeletePopup,
  },
});
</script>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 1s;
}

.slide-enter-to,
.slide-leave-from {
  overflow: hidden;
  max-height: 1000px;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
<template>
  <div
    class="block p-3 h-[100%] max-w-xl w-auto bg-black sm:border sm:border-white rounded-lg shadow-md flex-shrink-0">
    <div class="flex flex-col">
      <div class="flex items-center sm:justify-center">
        <img
          referrerpolicy="no-referrer"
          v-bind:src="
            user.profilePicture
              ? user.profilePicture.url
              : 'https://ui-avatars.com/api/?length=1' +
                '&name=' +
                user.username +
                '&background=' +
                color
          "
          class="w-10 rounded-[50%] sm:w-28 m-3"
          @error="
            'https://ui-avatars.com/api/?length=1' +
              '&name=' +
              user.username +
              '&background=' +
              color
          "
          alt="pofilepic" />
        <div>
          <div>
            <span class="font-bold ml-3">
              {{ user.username }}
            </span>
          </div>
          <div class="mt-[-3%]">
            <span class="ml-3 text-sm cursor-pointer" @click="showModal = true">
              {{ reverseGeo }}
            </span>
          </div>
          <div class="mt-[-3%]" v-if="post.music">
            <span class="ml-3 text-sm">
              {{ post.music.track }} - {{ post.music.artist }}
            </span>
            <audio controls v-if="post.music.preview">
              <source :src="post.music.preview" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
        <div>
          <!-- Add trash icon -->
          <img
            class="cursor-pointer h-6 ml-20"
            @click="this.$store.dispatch('deletePost')"
            v-if="isOwner"
            src="../../assets/icons8-trash-can.svg"
            alt="trash" />
        </div>
        <PopupModal v-if="showModal" @close="showModal = false">
          <template v-slot:body>
            <iframe
              title="map"
              class="ml-3"
              width="300"
              height="300"
              style="border: 0"
              loading="lazy"
              v-if="post.location"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
              :src="iframesrc">
            </iframe>
          </template>
        </PopupModal>
      </div>
      <div class="flex items-center justify-center">
        <div class="relative top-0 left-0 justify-center">
          <img
            referrerpolicy="no-referrer"
            v-bind:src="post.primary.url"
            class="relative top-0 left-0 rounded-md sm:w-[400px] w-[100%]"
            @click="hideSecondaryPhoto = !hideSecondaryPhoto"
            alt="postImage" />
          <img
            referrerpolicy="no-referrer"
            v-bind:src="post.secondary.url"
            class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
            @click="reverseImages"
            v-if="!hideSecondaryPhoto"
            alt="postImage" />
        </div>
      </div>

        <div class="flex items-center font-bold mt-2 justify-center">
          <span> {{ postdate() }} </span>
          <span class="ml-3">Retakes - {{ post.retakeCounter }}</span>
        </div>
        <div class="flex flex-col">
          <span v-if="post.caption">
            <span class="font-bold">{{ user.username + ": " }} </span>
            {{ post.caption }}
          </span>
        </div>
        <div v-if="post.comment" class="flex flex-col sm:w-[500px]">
          <div v-for="c in post.comment">
            <span class="font-bold"> {{ c.userName + ": " }}</span>
            <span v-html="cleancomment(c.text)"></span>
          </div>
        </div>
      </div>
      <div
        v-if="this.post.realMojis.length > 0"
        class="text-center mt-4 grid grid-cols-4 w-full gap-4">
        <Realmoji v-for="e in post.realMojis" :key="e.id" :realmoji="e" />
        <UploadRealmoji
          v-if="!isOwner"
          :postID="post.id"
          :postOwnerID="user.id" />
      </div>
    </div>
    <div class="flex my-5">
      <MyInput
        @enterPressed="submitComment"
        v-model="comment"
        placeholder="Comment"
        typeOfInput="text" />
      <MyButton @clickedd="submitComment" :loading="submitCommentLoading"
        >Submit</MyButton
      >
    </div>
  </div>
</template>
