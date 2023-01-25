<script>
import MyButton from "../ui/Button.vue";
import Realmoji from "./Realmoji.vue";
// FIND REALMOJI PATH AND URL DIFFERENCES SYNTAX
export default {
  //realmojis are the own realmojis
  props: ["postID", "realmojis"],
  data() {
    return {
      loading: false,
      user: this.$store.state.user,
      emojis: {
        "👍": {
          emoji: "👍",
          imageurl: null,
          file: null,
          media: {
            path: null
          }
        }, 
        "😃": {
          emoji: "😃",
          imageurl: null,
          file: null,
          media: {
            path: null
          }
        },
        "😂": {
          emoji: "😂",
          imageurl: null,
          file: null,
          media: {
            path: null
          }
        }, 
        "😲": {
          emoji: "😲",
          imageurl: null,
          file: null,
          media: {
            path: null
          }
        }, 
        "😍": {
          emoji: "😍",
          imageurl: null,
          file: null,
          media: {
            path: null
          }
        },
        "⚡": {
          emoji: "⚡",
          imageurl: null,
          file: null,
          media: {
            path: null
          }
          
        },
      }
    };
  },
  methods: {
    onFileChanged(e, emoji) {
      this.emojis[emoji].file = e.target.files[0]
      this.emojis[emoji].imageurl = URL.createObjectURL(this.emojis[emoji].file)
      console.log(this.emojis[emoji].imageurl)
    },
    async setRealmoji(file, emoji) {
      let response = await this.getSignedUploadURL(this.$type.realmoji)
      response = response.data
      await this.putFileIntoGoogleStorage(file, response)

      let imagePath = response.path
      this.emojis[emoji].media.path = imagePath
      this.loading = true;

      if (emoji != "⚡") {
        fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/person/me/realmojis`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json; charset=utf-8",
            authorization: `Bearer ${localStorage.getItem("token")}`,
            "accept-encoding": "gzip",
            "user-agent": "okhttp/4.10.0"
          },
          body: JSON.stringify({
            media: {
              path: imagePath != null ? imagePath : realmoji.media.url.substring(realmoji.media.url.search("Photos")),
              bucket: "storage.bere.al",
              width: 500,
              height: 500,
            },
            "emoji": emoji
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
          });
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$store.commit("error", "Failed to upload");
        });
      } else {
        this.reactRealmoji(this.emojis["⚡"])
      } 
      
    },
    async reactRealmoji(realmoji) {
      
      if (realmoji.emoji == "⚡") {
        fetch(`${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis/instant?postId=${this.postID}&postUserId=${this.user.id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            media: {
              bucket: "storage.bere.al",
              path: realmoji.media.path,
              width: 500,
              height: 500
            }
          })
        })
        .then(res => {
          if (res.status == 200) {
            this.$store.dispatch("getPosts").then((d) => {
              this.loading = false;
            });
          }
        })
      } else {
        console.log(realmoji.emoji)
        fetch(`${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/content/realmojis?postId=${this.postID}&postUserId=${this.user.id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            emoji: realmoji.emoji
          })
        }).then(res => {
          if (res.status == 200) {
            this.$store.dispatch("getPosts").then((d) => {
              this.loading = false;
            });
          }
        })
      }

    },
    async setRealmojis() {
      for (let key in this.emojis) {
        
        if (this.emojis[key].file != null) {
          
          await this.setRealmoji(this.emojis[key].file, this.emojis[key].emoji)
        }
      }
      this.$store.dispatch("getPosts").then((d) => {
        console.log("gotposts")
            this.loading = false;
          });
    }
  },

  components: { MyButton, Realmoji },
};
</script>
<template>
  <div class="flex items-center gap-3 flex-row flex-wrap">
    <!-- <div>Hi</div> -->
    <div class="flex" v-for="(emoji, index) of emojis">
      <Realmoji :postID="postID" @fileChanged="(e, moji) => onFileChanged(e, moji)" :file="emoji.file" :imageurl="emoji.imageurl" :emoji="emoji.emoji" @clicked=" () => reactRealmoji(realmojis.find(element => element.emoji == emoji.emoji))" :realmoji="realmojis.find(element => element.emoji == emoji.emoji)" :own="true"></Realmoji>
      <!--
      <div v-for="(realmoji, index) in realmojis"> 
        <Realmoji @clicked=" () => submitRealMoji(false, realmoji)" :realmoji="realmoji" :own="true"></Realmoji>
      </div>
      -->
        <!--
        <select v-model="type" class="w-80">
          <option disabled>Choose Emoji Type to upload</option>
          <option>😃</option>
          <option>😂</option>
          <option>👍</option>
          <option>😮</option>
          <option>😍</option>
        </select>
        -->
      </div>
      <!--
      <div>
        <label :for="postID">
          <div
            class="border-white w-24 h-24 rounded-[50%] border-2 cursor-pointer relative">
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
            <span class="absolute top-[50px] left-[60px] text-5xl">
              ⚡
            </span>
          </div>
        </label>
      </div>
      -->
        <MyButton @clickedd="setRealmojis" :loading="loading">Upload </MyButton>
    </div>
</template>