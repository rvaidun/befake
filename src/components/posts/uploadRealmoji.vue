<script>
import MyButton from "../ui/Button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
library.add(faFaceSmile);

export default {
  props: ["postID", "postOwnerID"],
  data() {
    return {
      file: null,
      imageurl: null,
      loading: false,
      image: {},
      user: this.$store.state.user,
      showRealmoji: false,
    };
  },
  methods: {
    onFileChange(e) {
      console.log(e);
      this.file = e.target.files[0];
      if (!this.file) return;
      this.imageurl = URL.createObjectURL(this.file);
      this.submitRealMoji();
    },
    async uploadPhotoToBeReal(file) {
      // https://cdn.bereal.network/Photos/WGpTqIX0diZQu3UjoZE8FnUAzNi2/realmoji/WGpTqIX0diZQu3UjoZE8FnUAzNi2-realmoji-instant-1669332458.webp
      // upload 2 files
      // get proxy url from state
      const getUploadUrl = () => {
        return fetch(
          `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis/upload-url?mimeType=image/webp`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
              accept: "*/*",
              "bereal-platform": "iOS",
              "bereal-os-version": "14.7.1",
              "accept-language": "en-US;q=1.0",
              "user-agent":
                "BeReal/0.28.2 (AlexisBarreyat.BeReal; build:8425; iOS 14.7.1) 1.0.0/BRApiKit",
              "bereal-app-language": "en-US",
              "bereal-timezone": "America/Los_Angeles",
              "bereal-device-language": "en",
            },
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to get upload url");
            }
            return res.json();
          })
          .then((data) => {
            return data;
          });
      };
      const putPhoto = (url, file, h) => {
        return fetch(`${this.$store.state.proxyUrl}/${url}`, {
          method: "PUT",
          headers: h,
          body: file,
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to upload photo");
          }
          return "success";
        });
      };
      const postRealmoji = (d, postid, postuserid) => {
        return fetch(
          `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis/instant?postId=${postid}&postUserId=${postuserid}`,
          {
            method: "PUT",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
              accept: "*/*",
              "bereal-platform": "iOS",
              "bereal-os-version": "14.7.1",
              "accept-language": "en-US;q=1.0",
              "bereal-app-language": "en-US",
              "user-agent":
                "BeReal/0.31.0 (AlexisBarreyat.BeReal; build:8586; iOS 14.7.1) 1.0.0/BRApiKit",
              "bereal-timezone": "America/Los_Angeles",
              "bereal-device-language": "en",
              "bereal-app-version": "0.31.0-(8586)",
            },
            body: JSON.stringify({
              media: {
                path: d.data.path,
                bucket: d.data.bucket,
                width: 500,
                height: 500,
              },
            }),
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to upload photo");
            }
            return res.json();
          })
          .then((data) => {
            console.log(data);
            return data;
          });
      };

      return new Promise((resolve, reject) => {
        let uud;
        getUploadUrl()
          .then((uploadUrlData) => {
            console.log(uploadUrlData);
            uud = uploadUrlData;
          })
          .then(() => putPhoto(uud.data.url, file, uud.data.headers))
          .then(() => {
            if (this.postID) {
              return postRealmoji(uud, this.postID, this.postOwnerID);
            }
            const promises = [];
            this.$store.state.posts.forEach((post) => {
              if (this.$store.state.user.id != post.user.id) {
                post.posts.forEach((p) => {
                  promises.push(postRealmoji(uud, post.user.id, p.id));
                });
              }
            });
            return Promise.all(promises);
          })
          .then(() => {
            resolve("Realmoji uploaded successfully!");
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async submitRealMoji() {
      if (this.file === undefined || this.file === null) {
        this.$store.commit("error", "No image selected");
        return;
      }
      this.loading = true;
      // call uploadPhotosToBeReal with primary and secondary images and on any response make loading false
      this.uploadPhotoToBeReal(this.file)
        .then(() => {
          this.loading = false;
          this.file = null;
          this.imageurl = null;
          this.$store.dispatch("getPosts");
        })
        .catch((e) => {
          this.loading = false;
          this.$store.commit("error", e);
        });
    },
    async submitPreset(emoji) {
      console.log(emoji);
      this.loading = true;
      fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis?postId=${this.postID}&postUserId=${this.postOwnerID}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            accept: "application/json",
            "content-type": "application/json",
            "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
            "accept-language": "en-US,en;q=0.9",
          },
          body: JSON.stringify({
            emoji,
          }),
        }
      ).then((res) => {
        this.loading = false;
        this.showRealmoji = false;
        if (!res.ok) {
          throw new Error("Failed to upload photo");
        }
        this.$store.dispatch("getPosts");
      });
    },
  },

  components: { MyButton, FontAwesomeIcon, PulseLoader },
};
</script>
<template>
  <div class="flex gap-3 items-center overflow-x-hidden">
    <div class="flex image-container gap-3" :class="{ revealed: showRealmoji }">
      <div
        v-for="(realmoji, i) in user.realmojis"
        :key="i"
        class="relative cursor-pointer w-24 flex-shrink-0">
        <img
          referrerpolicy="no-referrer"
          v-bind:src="realmoji.media.url"
          class="w-24 rounded-[50%]"
          @click="submitPreset(realmoji.emoji)" />

        <span class="absolute top-[50px] left-[60px] text-5xl"
          >{{ realmoji.emoji }}
        </span>
      </div>
      <label :for="postID">
        <div
          class="border-white w-24 h-24 rounded-[50%] border-2 cursor-pointer">
          <input
            type="file"
            :id="postID"
            style="display: none"
            name="image"
            @change="onFileChange" />

          <div v-if="!file" class="cursor-pointer">
            <img src="../../assets/add.svg" alt="plus" />
          </div>
          <div v-else class="cursor-pointer">
            <img
              :src="imageurl"
              class="w-24 rounded-[50%]"
              alt="realmoji to upload" />
          </div>
        </div>
      </label>
    </div>

    <font-awesome-icon
      :icon="['fas', 'face-smile']"
      class="text-6xl cursor-pointer"
      @click="showRealmoji = !showRealmoji"
      v-if="!loading" />
    <pulse-loader color="white" v-else></pulse-loader>
  </div>
</template>
<style>
.image-container {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
}

.revealed {
  transform: translateX(0);
  opacity: 1;
  pointer-events: all;
}
</style>
