<script>
import { defineComponent } from "vue";
import moment from "moment";
import PopupModal from "./PopupModal.vue";
import DeletePopup from "./deletePopup.vue";
import MyButton from "../ui/Button.vue";
import MyInput from "../ui/Input.vue";
import UploadRealmoji from "./uploadRealmoji.vue";
import Realmoji from "./Realmoji.vue";
export default defineComponent({
  props: ["post"],
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
      return moment(this.post.creationDate).format("MM-DD-YYYY h:mm:ss");
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
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/comments?postId=${this.post.id}&postUserId=${this.post.user.id}`,
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
        color += letters[this.post.user.username.charCodeAt(i) % 16];
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
    if (this.$store.state.user.id === this.post.user.id) {
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
  <div>
    <div class="w-full sm:w-auto bg-black">
      <div class="flex flex-col gap-3">
        <div class="flex items-center sm:justify-center gap-3">
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
            class="w-12 rounded-full sm:w-16"
            @error="
              'https://ui-avatars.com/api/?length=1' +
                '&name=' +
                post.user.username +
                '&background=' +
                color
            "
            alt="pofilepic" />
          <div class="w-full flex justify-between items-center">
            <div class="leading-4">
              <div class="font-bold">
                {{ post.user.username }}
              </div>
              <div class="flex gap-3">
                <div
                  v-if="reverseGeo"
                  class="text-sm cursor-pointer"
                  @click="showModal = true">
                  {{ reverseGeo }}
                </div>
                <div v-if="post.music">
                  <div class="text-sm">
                    {{ post?.music?.track }} - {{ post?.music?.artist }}
                  </div>
                  <audio controls v-if="post.music?.preview">
                    <source :src="post.music.preview" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
            <DeletePopup v-if="isOwner" />
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
          <div class="relative justify-center">
            <img
              referrerpolicy="no-referrer"
              v-bind:src="post.primary.url"
              class="rounded-md w-full"
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
            <UploadRealmoji
              v-if="!isOwner"
              :postID="post.id"
              :postOwnerID="post.ownerID" />
          </div>
        </div>
      </div>
      <div class="flex">
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
  </div>
</template>
