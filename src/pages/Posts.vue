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
import UploadProfilePicture from "../components/posts/uploadProfilePicture.vue";
import ReactToAll from "../components/ui/reactToAll.vue";
export default {
  components: {
    singlePostComponentVue,
    PulseLoader,
    NavbarVue,
    UploadPost,
    UploadProfilePicture,
    ReactToAll,
  },
  async beforeMount() {
    event("view_posts", {
      event_category: "posts",
      event_label: "view_posts",
    });
    Promise.all([
      this.$store.dispatch("getPosts"),
      // this.$store.dispatch("getUser"),
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
      //   `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/feeds/memories`,
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
        this.$store.commit("error", "Something went wrong while getting posts");
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
    ...mapState({
      user: (state) => state.user,
      posts: (state) => state.posts,
    }),
  },
};
</script>
<template>
  <div class="m-3">
    <a
      class="cursor-pointer text-red-500 rounded-md font-bold sm:hidden"
      href="https://ko-fi.com/rahulvaidun">
      Donate
    </a>
    <p class="sm:hidden">
      <span class="text-red-600">NEW!</span> <ReactToAll />
    </p>
    <UploadPost v-if="!isfetch && !posts.posted" :user="user" />
    <div
      v-for="post in posts"
      v-if="!isfetch"
      class="flex flex-col justify-center items-center dark:text-white">
      <single-post-component-vue :post="post" class="mt-10" />
    </div>
    <div v-else class="grid h-screen place-items-center">
      <pulse-loader color="white"></pulse-loader>
    </div>
  </div>
  <!-- <UploadProfilePicture :user="user" /> -->
</template>
