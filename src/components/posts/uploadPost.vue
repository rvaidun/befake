<script>
import UploadPostImage from "./uploadPostImage.vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { mapState } from "vuex";
import MyButton from "../ui/Button.vue";
import MyInput from "../ui/Input.vue";
export default {
  data() {
    return {
      loading: false,
      primary: {},
      secondary: {},
      location: {
        postwithlocation: false,
        lat: null,
        lng: null,
        devicelocation: false,
      },
      public: false,
      caption: "",
    };
  },
  components: { UploadPostImage, MyButton, MyInput },
  methods: {
    async upload(file, secondary) {
      if (secondary) {
        this.secondary.file = file;
      } else {
        this.primary.file = file;
      }
    },
    uploadPhotosToBeReal(primaryPhoto, secondaryPhoto) {
      // get upload url from BeReal
      const getUploadUrl = () => {
        return fetch(
          `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/posts/upload-url?mimeType=image/webp`,
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

      const putPhoto = (url, file) => {
        console.log(file);
        return fetch(`${this.$store.state.proxyUrl}/${url}`, {
          method: "PUT",
          headers: {
            accept: "*/*",
            "content-type": "image/webp",
            "cache-control": "public,max-age=172800",
            "x-goog-content-length-range": "1,1048576",
            "user-agent": "BeReal/8425 CFNetwork/1240.0.4 Darwin/20.6.0",
            "accept-language": "en-us",
          },
          body: file,
        })
          .then((res) => {
            if (!res.ok) {
              console.error("Failed to upload photo");
            }
            return res.text();
          })
          .then((data) => {
            console.log(data);
          });
      };

      // post new request to bereals post endpoint
      const postBeReal = (uploadUrlData) => {
        const nowt = moment();
        const taken_at = nowt.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        var payload = {
          visibilty: ["friends"],
          isLate: false,
          retakeCounter: 0,
          takenAt: taken_at,
          backCamera: {
            bucket: uploadUrlData.data[0].bucket,
            height: 1500,
            width: 2000,
            path: uploadUrlData.data[0].path,
          },
          frontCamera: {
            bucket: uploadUrlData.data[1].bucket,
            height: 1500,
            width: 2000,
            path: uploadUrlData.data[1].path,
          },
        };
        if (this.location.postwithlocation) {
          payload.location = {
            latitude: this.location.lat,
            longitude: this.location.lng,
          };
        }
        if (this.caption && this.caption !== "") {
          payload.caption = this.caption;
        }
        return fetch(
          `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/posts`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
              accept: "*/*",
              "bereal-platform": "iOS",
              "bereal-os-version": "14.7.1",
              "accept-language": "en-US;q=1.0",
              "bereal-app-language": "en-US",
              "user-agent":
                "BeReal/0.28.2 (AlexisBarreyat.BeReal; build:8425; iOS 14.7.1) 1.0.0/BRApiKit",
              "bereal-timezone": "America/Los_Angeles",
              "bereal-device-language": "en",
            },
            body: JSON.stringify(payload),
          }
        ).then((res) => {
          if (!res.ok) throw new Error("Failed to post BeReal");
        });
      };

      return new Promise((resolve, reject) => {
        // if no photos to upload
        if (!primaryPhoto && !secondaryPhoto) {
          reject("No photos to upload");
        }

        getUploadUrl()
          .then((uploadUrlData) => {
            Promise.all([
              putPhoto(uploadUrlData.data[0].url, primaryPhoto),
              putPhoto(uploadUrlData.data[1].url, secondaryPhoto),
            ]).then(() => postBeReal(uploadUrlData));
          })
          .then(() => {
            resolve("Successfully uploaded post to BeReal");
          })
          .catch((e) => {
            reject(e);
          });
      });
    },

    submitPost() {
      this.loading = true;
      // call uploadPhotosToBeReal with primary and secondary images and on any response make loading false
      this.uploadPhotosToBeReal(this.primary.file, this.secondary.file)
        .then(() => {
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.$store.commit("error", e);
        });
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
  computed: mapState(["user"]),
};
</script>
<template>
  <div class="flex flex-col justify-center items-center dark:text-white">
    <div
      class="block p-3 w-[100%] sm:p-6, sm:w-auto rounded-lg border border-gray-200 shadow-md bg-black">
      <div class="flex flex-col">
        <div class="flex items-center sm:justify-center">
          <img
            referrerpolicy="no-referrer"
            v-bind:src="
              user.profilePicture
                ? user.profilePicture.url
                : 'https://ui-avatars.com/api/?length=1' +
                  '&name=' +
                  user.username
            "
            class="w-10 rounded-[50%] sm:w-28"
            @error="
              'https://ui-avatars.com/api/?length=1' + '&name=' + user.username
            " />
          <div>
            <div>
              <span class="font-bold ml-3">
                {{ user.username }}
              </span>
            </div>
          </div>
        </div>
      </div>
      Upload a post
      <div class="sm:flex">
        <UploadPostImage :secondary="false" @upload="upload" class="m-1" />
        <UploadPostImage :secondary="true" @upload="upload" class="m-1" />
      </div>
      <!-- <input
        type="text"
        class="border border-gray-300 rounded-lg w-full p-2 text-black m-1"
        placeholder="Caption"
        v-model="caption"
      /> -->
      <MyInput v-model="caption" placeholder="Caption" />
      <input type="checkbox" class="m-1" v-model="public" />
      <span class="m-1">Public</span>
      <br />
      <input type="checkbox" class="m-1" v-model="location.postwithlocation" />
      <span class="m-1">Post with location</span>
      <div v-if="location.postwithlocation">
        <MyInput
          v-model="location.lat"
          placeholder="Latitude"
          @keypress="isNumber($event)" />
        <MyInput
          v-model="location.lng"
          placeholder="Longitude"
          @keypress="isNumber($event)" />
      </div>
      <!-- Submit -->
      <div class="flex justify-center">
        <MyButton @clickedd="submitPost" :loading="loading"> Submit </MyButton>
      </div>
    </div>
  </div>
</template>
