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
      retakes: 0,
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
    async submitPost() {
      this.loading = true;
      let imagePath1 = ""
      let imagePath2 = ""
      try {
        let response = await this.getSignedUploadURL(this.$type.post)
        response = response.data
        await this.putFileIntoGoogleStorage(this.primary.file, response["0"])
        await this.putFileIntoGoogleStorage(this.secondary.file, response["1"])

        imagePath1 = response["0"].path
        imagePath2 = response["1"].path
        this.primary.width = 1500
        this.primary.height = 2000
        this.secondary.width = 1500
        this.secondary.height = 2000
      } catch (e) {
        this.loading = false;
        console.log(e)
      }
      const nowt = moment();
      // moment to date string
      const taken_at = nowt.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      const payload = {
        isPublic: this.public,
        isLate: false,
        retakeCounter: this.retakes,
        takenAt: taken_at,
        // location: { latitude: "37.2297175", longitude: "-115.7911082" },
        // caption: "Testing 123123",
        backCamera: {
          bucket: "storage.bere.al",
          height: this.primary.height,
          width: this.primary.width,
          path: imagePath1,
        },
        frontCamera: {
          bucket: "storage.bere.al",
          height: this.secondary.height,
          width: this.secondary.width,
          path: imagePath2,
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
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/post`,
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
      <div class="d-flex align-items-center">
        <input type="number"
          class="border border-gray-300 rounded-lg p-2 text-black m-1"
          v-model.number="retakes" 
        />
        <span class="m-1">Retakes</span>
      </div>
      <input type="checkbox" class="m-1" v-model="public" />
      <span class="m-1">Public</span>
      <br />
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
