<script>
import { defineComponent } from "vue";
import moment from "moment";
import GoogleMapsModal from "./GoogleMapsModal.vue";
import MyButton from "../ui/Button.vue";
import MyInput from "../ui/Input.vue";
import UploadRealmoji from "./uploadRealmoji.vue";
import Realmoji from "./Realmoji.vue";
export default defineComponent({
  props: ["post"],
  data() {
    return {
      iframesrc: this.post.location
        ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyDPvCQ4RXgvhbboTmKh2qLnfY50aJxcD0E&q=${this.post.location._latitude}, ${this.post.location._longitude}`
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
      const temp = this.post.photoURL;
      this.post.photoURL = this.post.secondaryPhotoURL;
      this.post.secondaryPhotoURL = temp;
    },
    postdate() {
      return moment(this.post.creationDate._seconds * 1000).format(
        "MM-DD-YYYY h:mm:ss"
      );
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
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/comments?postId=${this.post.id}&postUserId=${this.post.ownerID}`,
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
      var letters = "0123456789ABCDEF";
      var color = "";
      for (var i = 0; i < 6; i++) {
        color += letters[this.post.user.username.charCodeAt(i) % 16];
      }
      return color;
    },
  },
  async beforeMount() {
    if (this.post.location) {
      fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${this.post.location._longitude},${this.post.location._latitude}&langCode=fr&outSR=&forStorage=false&f=pjson`
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
    if (this.$store.state.user.id === this.post.ownerID) {
      this.isOwner = true;
    }
  },
  components: { GoogleMapsModal, MyButton, MyInput, UploadRealmoji, Realmoji },
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
    class="block p-3 w-[100%] sm:w-auto bg-black sm:border sm:border-white rounded-lg shadow-md">
    <div class="flex flex-col">
      <div class="flex items-center sm:justify-center">
        <img
          referrerpolicy="no-referrer"
          v-bind:src="
            post.user.profilePicture
              ? post.user.profilePicture.url
              : 'https://ui-avatars.com/api/?length=1' +
                '&name=' +
                post.user.username +
                '&background=' +
                color
          "
          class="w-10 rounded-[50%] sm:w-28 m-3"
          @error="
            'https://ui-avatars.com/api/?length=1' +
              '&name=' +
              post.user.username +
              '&background=' +
              color
          " />
        <div>
          <div>
            <span class="font-bold ml-3">
              {{ post.user.username }}
            </span>
          </div>
          <div class="mt-[-3%]">
            <span class="ml-3 text-sm cursor-pointer" @click="showModal = true">
              {{ reverseGeo }}
            </span>
          </div>
        </div>
        <div>
          <!-- Add trash icon -->
          <img
            class="fill-white cursor-pointer"
            @click="this.$store.dispatch('deletePost')"
            v-if="isOwner"
            src="../../assets/icons8-trash-can.svg" />
        </div>
        <GoogleMapsModal v-if="showModal" @close="showModal = false">
          <template v-slot:body>
            <iframe
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
        </GoogleMapsModal>
      </div>
      <div class="flex items-center justify-center">
        <div class="relative top-0 left-0 justify-center">
          <img
            referrerpolicy="no-referrer"
            v-bind:src="post.photoURL"
            class="relative top-0 left-0 rounded-md sm:w-[400px] w-[100%]"
            @click="hideSecondaryPhoto = !hideSecondaryPhoto" />
          <img
            referrerpolicy="no-referrer"
            v-bind:src="post.secondaryPhotoURL"
            class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
            @click="reverseImages"
            v-if="!hideSecondaryPhoto" />
        </div>
      </div>

      <div class="flex items-center font-bold mt-2 justify-center">
        <span> {{ postdate() }} </span>
        <span class="ml-3">Retakes - {{ post.retakeCounter }}</span>
      </div>
      <div class="flex flex-col">
        <span v-if="post.caption">
          <span class="font-bold">{{ post.user.username + ": " }} </span>
          {{ post.caption }}
        </span>
      </div>
      <div v-if="post.comment" class="flex flex-col sm:w-[500px]">
        <div v-for="c in post.comment">
          <span class="font-bold"> {{ c.userName + ": " }}</span>
          <span v-html="cleancomment(c.text)"></span>
        </div>
      </div>
      <div class="text-center mt-4">
        <div class="flex flex-col mt-4 ml-[25%] w-[100%]">
          <div v-if="this.post.realMojis.length > 2">
            <Realmoji
              v-for="e in post.realMojis.slice(0, 2)"
              :key="e.id"
              :realmoji="e" />
            <Transition name="slide">
              <div v-if="showEmojis">
                <Realmoji
                  v-for="e in post.realMojis.slice(2)"
                  :key="e.id"
                  :realmoji="e" />
              </div>
            </Transition>
            <div class="flex items-center mb-2">
              <button
                class="px-2 py-1 border rounded-md font-bold text-black bg-white"
                @click="showEmojis = !showEmojis">
                {{
                  (showEmojis ? "Hide" : "Show") +
                  " " +
                  (this.post.realMojis.length - 2) +
                  " " +
                  (this.post.realMojis.length - 2 == 1
                    ? "realmoji"
                    : "realmojis")
                }}
              </button>
            </div>
          </div>
          <div v-else>
            <Realmoji v-for="e in post.realMojis" :key="e.id" :realmoji="e" />
          </div>

          <UploadRealmoji :postID="post.id" :postOwnerID="post.ownerID" />
        </div>
      </div>
    </div>
    <div class="flex">
      <MyInput v-model="comment" placeholder="Comment" />
      <!-- <input
        type="text"
        class="border border-gray-300 rounded-lg w-full p-2 text-black m-1"
        placeholder="Comment"
        v-model="comment"
      /> -->
      <MyButton @clickedd="submitComment" :loading="submitCommentLoading"
        >Submit</MyButton
      >
    </div>
  </div>
</template>
