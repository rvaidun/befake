<script>
import { defineComponent } from "vue";
import moment from "moment";
import PopupModal from "./PopupModal.vue";
import MyButton from "../ui/Button.vue";
import MyInput from "../ui/Input.vue";
import UploadRealmoji from "./uploadRealmoji.vue";
import Realmoji from "./Realmoji.vue";
import Carousel from "../ui/Carousel.vue";
export default defineComponent({
  props: ["post", "user"],
  data() {
    return {
      curpost: this.post[0],
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
      const temp = this.curpost.primary.url;
      this.curpost.primary.url = this.curpost.secondary.url;
      this.curpost.secondary.url = temp;
    },
    postdate() {
      return moment(this.curpost.creationDate).format("MM-DD-YYYY h:mm:ss");
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
      fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/comments?postId=${this.curpost.id}&postUserId=${this.user.id}`,
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
    scrollCarousel(i) {
      this.curpost = this.post[i];
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
    if (this.curpost.location) {
      fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${this.curpost.location.longitude},${this.curpost.location.latitude}&langCode=fr&outSR=&forStorage=false&f=pjson`
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
    Carousel,
  },
});
</script>
<template>
  <div
    class="block w-[100%] bg-black rounded-lg shadow-md sm:w-auto border border-white p-3 sm:max-w-fit sm:h-[100%]">
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
          <div class="mt-[-3%]" v-if="curpost.music">
            <span class="ml-3 text-sm">
              {{ curpost.music.track }} - {{ curpost.music.artist }}
            </span>
            <audio controls v-if="curpost.music.preview">
              <source :src="curpost.music.preview" type="audio/mpeg" />
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
              v-if="curpost.location"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
              :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBR4u3SrXLjJ7sdfvj3ltu4DvjVmiXnh18&q=${this.curpost.location.latitude}, ${this.curpost.location.longitude}`">
            </iframe>
          </template>
        </PopupModal>
      </div>
      <div class="flex items-center justify-center">
        <Carousel
          v-if="post.length > 1"
          :length="post.length"
          @scroll="scrollCarousel">
          <div
            class="relative flex-shrink-0 snap-start w-[100%] snap-normal"
            v-for="p in post">
            <img
              referrerpolicy="no-referrer"
              v-bind:src="p.primary.url"
              class="relative top-0 left-0 rounded-md w-[400px]"
              @click="hideSecondaryPhoto = !hideSecondaryPhoto"
              alt="postImage" />
            <img
              referrerpolicy="no-referrer"
              v-bind:src="p.secondary.url"
              class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
              @click="reverseImages"
              v-if="!hideSecondaryPhoto"
              alt="postImage" />
          </div>
        </Carousel>
        <div class="relative top-0 left-0 justify-center" v-else>
          <img
            referrerpolicy="no-referrer"
            v-bind:src="curpost.primary.url"
            class="relative top-0 left-0 rounded-md sm:w-[400px] w-[100%]"
            @click="hideSecondaryPhoto = !hideSecondaryPhoto"
            alt="postImage" />
          <img
            referrerpolicy="no-referrer"
            v-bind:src="curpost.secondary.url"
            class="absolute top-2 left-2 w-[35%] rounded-md border-2 border-black"
            @click="reverseImages"
            v-if="!hideSecondaryPhoto"
            alt="postImage" />
        </div>
      </div>

      <div class="flex items-center font-bold mt-2 justify-center">
        <span> {{ postdate() }} </span>
        <span class="ml-3">Retakes - {{ curpost.retakeCounter }}</span>
      </div>
      <div class="flex flex-col">
        <span v-if="curpost.caption">
          <span class="font-bold">{{ user.username + ": " }} </span>
          {{ curpost.caption }}
        </span>
      </div>
      <div v-if="curpost.comments" class="flex flex-col sm:w-[500px]">
        <div v-for="c in curpost.comments">
          <span class="font-bold"> {{ c.user.username + ": " }}</span>
          <span v-html="cleancomment(c.content)"></span>
        </div>
      </div>
      <div class="flex gap-3 items-center overflow-auto mt-4">
        <Realmoji :key="e.id" :realmoji="e" v-for="e in curpost.realMojis" />
      </div>
      <div class="flex justify-end">
        <UploadRealmoji
          v-if="!isOwner"
          :postID="curpost.id"
          :postOwnerID="user.id" />
      </div>
    </div>
    <div class="flex mb-5">
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
