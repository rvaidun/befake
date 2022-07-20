<script>
import moment from "moment";
import { defineComponent } from "vue";
import singlePostComponentVue from "./singlePostComponent.vue";
import { copyText } from "vue3-clipboard";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default defineComponent({
  components: {
    singlePostComponentVue,
    PulseLoader,
  },
  props: ["logout"],
  async beforeMount() {
    if (Date.now() > localStorage.getItem("expiration")) {
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
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: localStorage.getItem("refreshToken"),
          }),
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
        })
        .catch((err) => {
          console.log(err);
          localStorage.clear();
          this.logout();
        });
    }
    Promise.all([
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
        }),
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
        }),
      fetch(
        "https://arcane-woodland-79412.herokuapp.com/https://mobile.bereal.com/api/feeds/memories",
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
          this.memories = data.data;
        }),
    ])
      .then(() => {
        this.isfetch = false;
      })
      .catch((err) => {
        console.log(err);
        localStorage.clear();
        this.logout();
      });
  },
  data() {
    return {
      phone: "",
      sessionInfo: "",
      code: "",
      posts: [],
      friends: [],
      memories: [],
      isfetch: true,
      copy: JSON.stringify({
        token: localStorage.getItem("token") ?? "",
        refreshToken: localStorage.getItem("refreshToken") ?? "",
        expiration: localStorage.getItem("expiration") ?? "",
        phone: localStorage.getItem("phone") ?? "",
      }),
    };
  },
  methods: {
    timenow() {
      return moment().format("MMMM Do YYYY, h:mm:ss a");
    },
  },
});
</script>
<template>
  <!-- print time right now with moment -->
  <div class="bg-blue-300 flex py-2 dark:bg-blue-900 dark:text-white">
    <div class="mr-auto invisible"></div>
    <div class="mr-auto">
      <a @click="doCopy" class="sm:text-3xl font-bold">{{ timenow() }}</a>
    </div>
    <button
      v-clipboard:copy="copy"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
    >
      Copy Credentials
    </button>
    <button
      @click="logout"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
    >
      Logout
    </button>
  </div>
  <div
    v-for="post in posts"
    v-if="!isfetch"
    class="flex flex-col justify-center items-center dark:text-white"
  >
    <single-post-component-vue
      v-if="post.members.length > 0"
      :post="post"
      :friend="friends.find((o) => o['id'] === post['ownerID'])"
      class="mt-10"
    />
  </div>
  <div v-else class="grid h-screen place-items-center">
    <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
  </div>
</template>
