<script>
import { mapState } from "vuex";
import MyButton from "../ui/Button.vue";
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
    async submitProfilePicture() {
      this.loading = true;

      const token = localStorage.getItem("token");

      var myHeaders = new Headers();
      myHeaders.append("authorization", `Bearer ${token}`);
      myHeaders.append("bereal-platform", " android ");
      myHeaders.append("bereal-app-language", " en ");
      myHeaders.append("bereal-device-language", " en ");
      myHeaders.append("bereal-app-version", " 0.61.4 ");
      myHeaders.append("bereal-os-version", " 8.1.0 ");
      myHeaders.append("bereal-timezone", " Europe/Vienna ");
      myHeaders.append("x-datadog-origin", " rum ");
      myHeaders.append("x-datadog-sampling-priority", " 1 ");
      myHeaders.append("x-datadog-sampled", " 1 ");
      myHeaders.append("content-type", " multipart/form-data; boundary=1d7432d0-1495-464e-9bbe-880ad05c9dd5 ");
      myHeaders.append("accept-encoding", " gzip ");
      myHeaders.append("user-agent", " okhttp/4.10.0");

      var formdata = new FormData();
      formdata.append("file", file);

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: formdata
      };
      fetch("https://mobile.bereal.com/api/person/me/profile-picture", requestOptions)
        .then((res) => {
          if (res.status !== 200) throw new Error("Failed to upload");
          return res.json();
        })
        .then((data) => {
          console.log("updated profile picture");
          console.log(data);
          this.loading = false;
          this.file = null;
          this.imageurl = null;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$store.commit("error", "Failed to upload");
        });
    },
  },
  async beforeMount() {
    console.log('u:', this.user)
  },
  computed: mapState(["user"]),
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
      " />


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
            <svg
              class="w-24 h-24 rp"
              width="107"
              height="107"
              viewBox="0 0 107 107"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect
                x="18.3429"
                y="45.8571"
                width="69.8048"
                height="15.2857"
                fill="white" />
              <rect
                x="45.8571"
                y="88.1476"
                width="69.8048"
                height="15.2857"
                transform="rotate(-90 45.8571 88.1476)"
                fill="white" />
            </svg>
          </div>
          <div v-else class="cursor-pointer">
            <img :src="imageurl" class="w-24 rounded-[50%]" />
          </div>
        </div>
      </label>
    </div>


    <div>
      <MyButton @clickedd="submitProfilePicture" :loading="false">Update Profile Picture</MyButton>
    </div>
  </div>
</template>