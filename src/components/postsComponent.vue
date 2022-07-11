<script>
import { defineComponent } from "vue";
import singlePostComponentVue from "./singlePostComponent.vue";
export default defineComponent({
  components: {
    singlePostComponentVue,
  },
  props: ["loggedIn"],
  async beforeMount() {
    if (Date.now() > localStorage.getItem("expiration")) {
      console.log("hi");
      await fetch(
        "https://arcane-woodland-79412.herokuapp.com/https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-firebase-client":
              "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone13,2 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/15.5 xcode/13F100",
            accept: "*/*",
            "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
            "x-firebase-client-log-type": "0",
            "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
            "accept-language": "en",
            "user-agent":
              "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/15.5 hw/iPhone13_2",
            "x-firebase-locale": "en",
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem(
            "expiration",
            Date.now() + data.expires_in * 1000
          );
          localStorage.setItem("refreshToken", data.refresh_token);
        });
    }
    fetch(
      "https://arcane-woodland-79412.herokuapp.com/https://mobile.bereal.com/api/feeds/friends",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
          "accept-language": "en-US,en;q=0.9",
          authorization: localStorage.getItem("token") ?? "",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        this.posts = data;
        this.isfetch1 = false;
      });
    fetch(
      "https://arcane-woodland-79412.herokuapp.com/https://mobile.bereal.com/api/relationships/friends",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
          authorization: localStorage.getItem("token") ?? "",
          "accept-language": "en-US,en;q=0.9",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        this.friends = data.data;
        this.isfetch2 = false;
      });
  },
  data() {
    return {
      phone: "",
      sessionInfo: "",
      code: "",
      posts: [],
      friends: [],
      isfetch1: true,
      isfetch2: true,
    };
  },
});
</script>
<template>
  <div v-for="post in posts" v-if="!isfetch1 && !isfetch2">
    <single-post-component-vue
      v-if="post.members.length > 0"
      :post="post"
      :friend="friends.find((o) => o['id'] === post['ownerID'])"
      class="mt-10"
    ></single-post-component-vue>
  </div>
</template>
