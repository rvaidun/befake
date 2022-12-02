<script>
import moment from "moment";
import { defineComponent } from "vue";
import singlePostComponentVue from "../components/posts/singlePostComponent.vue";
import { copyText } from "vue3-clipboard";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { event } from "vue-gtag";
import NavbarVue from "../components/layout/Navbar.vue";
import UploadPost from "../components/posts/uploadPost.vue";
import { mapState } from "vuex";
export default {
  components: {
    singlePostComponentVue,
    PulseLoader,
    NavbarVue,
    UploadPost,
  },
  async beforeMount() {
    event("view_posts", {
      event_category: "posts",
      event_label: "view_posts",
    });
    if (Date.now() > localStorage.getItem("expiration")) {
      await fetch(
        `${this.$store.state.proxyUrl}/https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA`,
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
          this.$store.commit("logout");
        });
    }
    Promise.all([
      this.$store.dispatch("getPosts"),
      this.$store.dispatch("getUser"),
      // fetch(
      //   "https://arcane-woodland-79412.herokuapp.com/https://mobile.bereal.com/api/relationships/friends",
      //   {
      //     method: "GET",
      //     headers: {
      //       accept: "application/json",
      //       "content-type": "application/json",
      //       "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
      //       authorization: localStorage.getItem("token") ?? "",
      //       "accept-language": "en-US,en;q=0.9",
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     this.friends = data.data;
      //   }),
      // fetch(
      //   "https://arcane-woodland-79412.herokuapp.com/https://mobile.bereal.com/api/feeds/memories",
      //   {
      //     method: "GET",
      //     headers: {
      //       accept: "application/json",
      //       "content-type": "application/json",
      //       "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
      //       authorization: localStorage.getItem("token") ?? "",
      //       "accept-language": "en-US,en;q=0.9",
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     this.memories = data.data;
      //   }),
    ])
      .then(() => {
        this.isfetch = false;
      })
      .catch((err) => {
        console.log(err);
        localStorage.clear();
        this.$store.commit("logout");
      });
  },
  data() {
    return {
      phone: "",
      sessionInfo: "",
      code: "",
      friends: [],
      memories: [],
      isfetch: true,
    };
  },
  methods: {
    timenow() {
      return moment().format("MMMM Do YYYY, h:mm:ss a");
    },
  },
  computed: {
    UserPosted() {
      if (this.posts.length > 0) {
        console.log("here");
        var base64Url = localStorage.getItem("token");
        base64Url = base64Url.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        var my_id = JSON.parse(jsonPayload).user_id;
        return this.posts.filter((post) => post.ownerID === my_id).length > 0;
      }
    },
    ...mapState({
      user: (state) => state.user,
      posts: (state) => state.posts,
    }),
  },
};
</script>
<template>
  <UploadPost v-if="!isfetch && !UserPosted" :user="user" />
  <div
    v-for="post in posts"
    v-if="!isfetch"
    class="flex flex-col justify-center items-center dark:text-white"
  >
    <single-post-component-vue :post="post" class="mt-10" />
  </div>
  <div v-else class="grid h-screen place-items-center">
    <pulse-loader color="white"></pulse-loader>
  </div>
</template>
