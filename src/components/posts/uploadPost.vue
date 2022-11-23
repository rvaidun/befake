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
      console.log(file.size);
      if (secondary) {
        this.secondary.file = file;
      } else {
        this.primary.file = file;
      }
    },
    async uploadPhotoToBeReal(file, secondary) {
      // upload 2 files
      console.log("user is ", this.user);
      const n = `Photos/${this.user.id}/bereal/${uuidv4()}-${moment().unix()}${
        secondary ? "-secondary" : ""
      }.jpg`;
      console.log(n);
      const json_data = {
        cacheControl: "public,max-age=172800",
        contentType: "image/jpeg",
        metadata: { type: "bereal" },
        name: n,
      };
      const headers = {
        "x-goog-upload-protocol": "resumable",
        "x-goog-upload-command": "start",
        "x-firebase-storage-version": "ios/9.4.0",
        "x-goog-upload-content-type": "image/jpeg",
        Authorization: `Firebase ${localStorage.getItem("token")}`,
        "x-goog-upload-content-length": file.size.toString(),
        "content-type": "application/json",
        "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
        "user-agent":
          "AlexisBarreyat.BeReal/0.24.0 iPhone/16.0 hw/iPhone13_2 (GTMSUF/1)",
      };
      const params = {
        uploadType: "resumable",
        name: n,
      };
      const uri = `https://warm-scrubland-06418.herokuapp.com/https://firebasestorage.googleapis.com/v0/b/storage.bere.al/o/${encodeURIComponent(
        n
      ).replace(/%20/g, "")}?`;
      await fetch(uri + new URLSearchParams(params), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(json_data),
      }).then(async (res) => {
        // console log the status code
        if (res.status !== 200) throw new Error("Failed to upload");
        const uploadurl =
          "https://warm-scrubland-06418.herokuapp.com/" +
          res.headers.get("x-goog-upload-url");
        const headers2 = {
          "x-goog-upload-command": "upload, finalize",
          "x-goog-upload-protocol": "resumable",
          "x-goog-upload-offset": "0",
          "content-type": "image/jpeg",
        };
        await fetch(uploadurl, {
          method: "PUT",
          headers: headers2,
          body: file,
        })
          .then((res) => {
            if (res.status !== 200) throw new Error("Failed to upload");
            return res.json();
          })
          .then((data) => {
            console.log(data);
            if (secondary) {
              this.secondary.url = `https://${data.bucket}/${data.name}`;
              this.secondary.width = 1500;
              this.secondary.height = 2000;
            } else {
              this.primary.url = `https://${data.bucket}/${data.name}`;
              this.primary.width = 1500;
              this.primary.height = 2000;
            }
          });
      });
    },
    async submitPost() {
      this.loading = true;
      try {
        await this.uploadPhotoToBeReal(this.primary.file, false);
        await this.uploadPhotoToBeReal(this.secondary.file, true);
      } catch (e) {
        this.loading = false;
      }
      const nowt = moment();
      // moment to date string
      const taken_at = nowt.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      const payload = {
        isPublic: this.public,
        isLate: false,
        retakeCounter: 0,
        takenAt: taken_at,
        // location: { latitude: "37.2297175", longitude: "-115.7911082" },
        // caption: "Testing 123123",
        backCamera: {
          bucket: "storage.bere.al",
          height: this.primary.height,
          width: this.primary.width,
          path: this.primary.url.replace("https://storage.bere.al/", ""),
        },
        frontCamera: {
          bucket: "storage.bere.al",
          height: this.secondary.height,
          width: this.secondary.width,
          path: this.secondary.url.replace("https://storage.bere.al/", ""),
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
      const h1 = {
        "content-type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      };
      fetch(
        "https://warm-scrubland-06418.herokuapp.com/https://mobile.bereal.com/api/content/post",
        {
          method: "POST",
          headers: h1,
          body: JSON.stringify(payload),
        }
      )
        .then((res) => {
          if (res.status !== 201) throw new Error("Failed to upload");
          return res.json();
        })
        .then((data) => {
          console.log(data);
          this.$store.dispatch("getPosts").then((d) => {
            this.loading = false;
          });
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
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
      class="block p-3 w-[100%] sm:p-6, sm:w-auto rounded-lg border border-gray-200 shadow-md bg-black"
    >
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
          />
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
      <input type="checkbox" class="m-1" v-model="location.postwithlocation" />
      <span class="m-1">Post with location</span>
      <div v-if="location.postwithlocation">
        <MyInput
          v-model="location.lat"
          placeholder="Latitude"
          @keypress="isNumber($event)"
        />
        <MyInput
          v-model="location.lng"
          placeholder="Longitude"
          @keypress="isNumber($event)"
        />
      </div>
      <!-- Submit -->
      <div class="flex justify-center">
        <MyButton @clickedd="submitPost" :loading="loading"> Submit </MyButton>
      </div>
    </div>
  </div>
</template>
