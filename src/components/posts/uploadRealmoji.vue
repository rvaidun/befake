<script>
import MyButton from "../ui/Button.vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
export default {
  props: ["postID", "postOwnerID"],
  data() {
    return {
      file: null,
      imageurl: null,
      loading: false,
      image: {},
      user: this.$store.state.user,
    };
  },
  methods: {
    onFileChange(e) {
      console.log(e);
      this.file = e.target.files[0];
      this.imageurl = URL.createObjectURL(this.file);
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
      const postRealmoji = (d) => {
        return fetch(
          `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis/instant?postId=${this.postID}&postUserId=${this.postOwnerID}`,
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
          .then(() => postRealmoji(uud))
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
  },

  components: { MyButton },
};
</script>
<template>
  <div class="flex items-center gap-3">
    <div>
      <label :for="postID">
        <div
          class="border-white w-24 h-24 rounded-[50%] border-2 cursor-pointer">
          <input
            type="file"
            :id="postID"
            style="display: none"
            name="image"
            @change="onFileChange" />

          <div v-if="!file">
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
    <div>
      <MyButton @clickedd="submitRealMoji" :loading="loading">Upload</MyButton>
    </div>
  </div>
</template>
