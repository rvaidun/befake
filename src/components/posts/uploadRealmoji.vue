<script>
import MyButton from "../ui/Button.vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
export default {
  props: ["postID"],
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
      //   this.$emit("upload", this.file, this.secondary);
    },
    async uploadPhotoToBeReal(file, secondary) {
      // https://cdn.bereal.network/Photos/WGpTqIX0diZQu3UjoZE8FnUAzNi2/realmoji/WGpTqIX0diZQu3UjoZE8FnUAzNi2-realmoji-instant-1669332458.webp
      // upload 2 files
      // get proxy url from state
      console.log("user is ", this.user);
      const n = `Photos/${this.user.id}/realmoji/${
        this.user.id
      }-realmoji-instant-${moment().unix()}.jpg`;
      console.log(n);
      const json_data = {
        cacheControl: "public,max-age=172800",
        contentType: "image/jpeg",
        metadata: {
          type: "instantRealmoji",
          uid: this.user.id,
          creationDate: moment().format("ddd MMM D Y HH:mm:ss [GMT+0000]"),
        },
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
      const uri = `${
        this.$store.state.proxyUrl
      }/https://firebasestorage.googleapis.com/v0/b/storage.bere.al/o/${encodeURIComponent(
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
          this.$store.state.proxyUrl +
          "/" +
          res.headers.get("x-goog-upload-url");
        const headers2 = {
          "x-goog-upload-command": "upload, finalize",
          "x-firebase-storage-version": "ios/9.4.0",
          "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
          "x-goog-upload-command": "upload, finalize",
          "x-goog-upload-protocol": "resumable",
          "x-goog-upload-offset": "0",
          "content-type": "application/x-www-form-urlencoded",
          authorization: `Firebase ${localStorage.getItem("token")}`,
        };
        await fetch(uploadurl, {
          method: "POST",
          headers: headers2,
          body: file,
        })
          .then((res) => {
            if (res.status !== 200) throw new Error("Failed to upload");
            return res.json();
          })
          .then((data) => {
            console.log(data);
            this.image.url = `https://${data.bucket}/${data.name}`;
            this.image.width = 500;
            this.image.height = 500;
            this.image.path = `${data.bucket}/${data.name}`.replace(
              "storage.bere.al/",
              ""
            );
          });
      });
    },
    async submitRealMoji() {
      this.loading = true;
      console.log(this.postID);
      try {
        await this.uploadPhotoToBeReal(this.file);
      } catch (err) {
        console.log(err);
        return;
      }
      fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis/instant?postId=${this.postID}&postUserId=${this.user.id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            media: {
              path: this.image.path,
              bucket: "storage.bere.al",
              width: 500,
              height: 500,
            },
          }),
        }
      )
        .then((res) => {
          if (res.status !== 200) throw new Error("Failed to upload");
          return res.json();
        })
        .then((data) => {
          console.log(data);
          console.log(data);
          this.$store.dispatch("getPosts").then((d) => {
            this.loading = false;
            this.file = null;
            this.imageurl = null;
          });
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$store.commit("error", "Failed to upload");
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
    <!-- <div>Hi</div> -->
    <div>
      <MyButton @clickedd="submitRealMoji" :loading="loading">Upload </MyButton>
    </div>
  </div>
</template>
