<!-- create simple vue.js component -->
<script>
import PopupModal from "../posts/PopupModal.vue";
import MyButton from "../ui/Button.vue";
export default {
  name: "ReactToAll",
  components: {
    PopupModal,
    MyButton,
  },
  data() {
    return {
      showPopup: false,
      popupTitle: "React to all posts",
      popupContent: "Are you sure you want to react to all posts?",
      file: null,
      imageurl: null,
      loading: false,
      image: {},
    };
  },
  methods: {
    closePopup() {
      this.showPopup = false;
    },
    onFileChange(e) {
      console.log(e);
      this.file = e.target.files[0];
      this.imageurl = URL.createObjectURL(this.file);
    },
    async uploadRealmojis(file) {
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
      const postRealmoji = (d, postOwnerID, postID) => {
        return fetch(
          `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis/instant?postId=${postID}&postUserId=${postOwnerID}`,
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
            console.log("postsLoaded: ", this.postsLoaded);
            const promises = [];
            // for (const post in this.$store.state.posts) {
            //   if (this.$store.state.user.id != this.postsLoaded[post].ownerID) {
            //     promises.push(
            //       postRealmoji(
            //         uud,
            //         this.postsLoaded[post].ownerID,
            //         this.postsLoaded[post].id
            //       )
            //     );
            //   }
            // }
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

    submitRealMojis() {
      if (this.file === undefined || this.file === null) {
        this.$store.commit("error", "No image selected");
        return;
      }
      this.loading = true;
      this.uploadRealmojis(this.file)
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
};
</script>

<style scoped>
.text-rainbow {
  background-image: linear-gradient(
    to left,
    rgb(240, 130, 240),
    rgb(190, 112, 245),
    rgb(0, 195, 255),
    rgb(0, 255, 0),
    rgb(255, 255, 0),
    rgb(255, 165, 0),
    rgb(255, 79, 79)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<template>
  <span
    class="cursor-pointer text-rainbow sm:py-2 py-[0.6px] sm:px-3 rounded-md font-bold"
    @click="showPopup = true"
    >{{ popupTitle }}</span
  >
  <PopupModal v-if="showPopup" @close="closePopup">
    <template v-slot:body>
      <div class="flex items-center flex-col gap-2 text-black">
        <h3 class="font-bold">{{ popupTitle }}</h3>
        <p class="pb-10">{{ popupContent }}</p>
      </div>
      <div class="flex items-center gap-3">
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
              <img
                :src="imageurl"
                class="w-24 rounded-[50%]"
                alt="realmoji to upload" />
            </div>
          </div>
        </label>

        <div>
          <MyButton @clickedd="submitRealMojis" :loading="loading"
            >Upload Realmojis</MyButton
          >
        </div>
      </div>
    </template>
  </PopupModal>
</template>
