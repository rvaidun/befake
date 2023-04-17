<script>
import MyButton from "../ui/Button.vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
export default {
  props: ["user"],
  data() {
    return {
      file: null,
      imageurl: null,
      loading: false,
      image: {},
    };
  },
  methods: {
    onFileChange(e) {
      console.log(e);
      this.file = e.target.files[0];
      this.imageurl = URL.createObjectURL(this.file);
    },
    async uploadPhotoToBeReal(file) {
      const getUploadUrl = () => {
        return fetch(
          `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/person/me/profile-picture`,
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
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to upload photo");
            }
            return res.json();
          })
          .then((data) => {
            console.log(data);
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
        if (!file) {
          reject("No file");
        }
        let uud;
        getUploadUrl()
          .then((uploadUrlData) => {
            console.log(uploadUrlData);
            uud = uploadUrlData;
          })
          .then(() => {
            putPhoto(uud.data.url, file, uud.data.headers);
            console.log(uud);
          })
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
  <div class="flex sm:flex-row flex-col justify-center items-center gap-3 p-3">
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
      class="w-24 rounded-[50%] border-2"
      @error="
        'https://ui-avatars.com/api/?length=1' +
          '&name=' +
          user.username +
          '&background=' +
          color
      "
      alt="ppic" />

    <div>
      <label>
        <div
          class="border-white w-24 h-24 rounded-[50%] border-2 cursor-pointer">
          <input
            type="file"
            style="display: none"
            name="image"
            @change="onFileChange" />

          <div v-if="!file">
            <img src="../../assets/add.svg" alt="plus" />
          </div>
          <div v-else class="cursor-pointer">
            <img :src="imageurl" class="w-24 rounded-[50%]" alt="zamkor" />
          </div>
        </div>
      </label>
    </div>

    <div>
      <MyButton @clickedd="submitProfilePicture" :loading="false"
        >Update Profile Picture</MyButton
      >
    </div>
  </div>
</template>
