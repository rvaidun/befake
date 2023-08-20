<script>
import UploadPostImage from "./uploadPostImage.vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { mapState } from "vuex";
import MyButton from "../ui/Button.vue";
import MyInput from "../ui/Input.vue";
import MyCheckbox from "../ui/myCheckbox.vue";
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
      postontime: false,
      public: false,
      retakes: null,
      caption: "",
    };
  },
  components: { UploadPostImage, MyButton, MyInput, MyCheckbox },
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
            console.log(data);
            return data;
          });
      };

      const putPhoto = (url, file, h) => {
        console.log(file);
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

      // post new request to bereals post endpoint
      const postBeReal = async (uploadUrlData) => {
        let taken_at;
        if (this.postontime) {
          taken_at = await this.getRandomTimeInBetween();
        } else {
          taken_at = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        }
        // const taken_at = moment
        //   .unix(1692470202)
        //   .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        let payload = {
          visibility: ["friends"],
          isLate: false,
          retakeCounter: Number(this.retakes),
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
        console.log(JSON.stringify(payload));
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
        let uud;

        getUploadUrl()
          .then((uploadUrlData) => {
            uud = uploadUrlData;
            console.log(uud);
          })
          .then(() =>
            Promise.all([
              putPhoto(uud.data[0].url, primaryPhoto, uud.data[0].headers),
              putPhoto(uud.data[1].url, secondaryPhoto, uud.data[1].headers),
            ])
          )
          .then(() => postBeReal(uud))
          .then(() => resolve("Successfully uploaded post to BeReal"))
          .catch((e) => reject(e));
      });
    },

    submitPost() {
      console.log(this.primary.file, this.secondary.file);
      if (
        this.primary.file === undefined ||
        this.secondary.file === undefined
      ) {
        this.$store.commit(
          "error",
          "Primary and secondary images are required"
        );
        return;
      }
      this.loading = true;
      // call uploadPhotosToBeReal with primary and secondary images and on any response make loading false
      this.uploadPhotosToBeReal(this.primary.file, this.secondary.file)
        .then(() => {
          this.loading = false;
          this.$store.dispatch("getPosts");
        })
        .catch((e) => {
          this.loading = false;
          this.$store.commit("error", e);
        });
    },
    getRandomTimeInBetween() {
      console.log(this.$store.state.user.region);
      return fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/bereal/moments/last/${this.$store.state.user.region}`,
        {
          method: "GET",
          headers: {
            origin: "https://mobile.bereal.com",
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          const dateA = moment(data.startDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");
          const dateB = moment(data.endDate, "YYYY-MM-DDTHH:mm:ss.SSSZ");

          const randomDate = moment(
            dateA + Math.random() * (dateB - dateA)
          ).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          return randomDate;
        });
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
            "
            alt="avatar" />
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
        <p>First box is back camera. Second box is front camera.</p>
        <UploadPostImage :secondary="false" @upload="upload" class="m-1" />
        <UploadPostImage :secondary="true" @upload="upload" class="m-1" />
      </div>
      <div class="d-flex align-items-center">
        <MyInput v-model="caption" placeholder="Caption" typeOfInput="text" />
        <MyInput v-model="retakes" placeholder="Retakes" typeOfInput="number" />
      </div>
      <MyCheckbox class="m-1" v-model="public" />
      <span class="m-1">Public</span>
      <br />
      <MyCheckbox class="m-1" v-model="location.postwithlocation" />
      <span class="m-1">Post with location</span>
      <div v-if="location.postwithlocation">
        <MyInput
          v-model="location.lat"
          placeholder="Latitude"
          typeOfInput="number" />
        <MyInput
          v-model="location.lng"
          placeholder="Longitude"
          typeOfInput="number" />
      </div>
      <br />
      <MyCheckbox class="m-1" v-model="postontime" />
      <span class="m-1">Post on time</span>

      <!-- Submit -->
      <div class="flex justify-center">
        <MyButton @clickedd="submitPost" :loading="loading"> Submit </MyButton>
      </div>
    </div>
  </div>
</template>
