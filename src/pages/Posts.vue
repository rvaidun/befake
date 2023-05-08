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
import Carousel from "../components/ui/Carousel.vue";
export default {
  components: {
    singlePostComponentVue,
    PulseLoader,
    NavbarVue,
    UploadPost,
    UploadProfilePicture,
    ReactToAll,
    Carousel,
  },
  async beforeMount() {
    event("view_posts", {
      event_category: "posts",
      event_label: "view_posts",
    });
    Promise.all([this.$store.dispatch("getPosts")])
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
  <div class="p-3 md:p-0 max-w-xl mx-auto flex flex-col gap-10">
    <div>
      <a
        class="cursor-pointer text-red-500 rounded-md font-bold sm:hidden"
        href="https://ko-fi.com/rahulvaidun">
        Donate
      </a>
      <p class="sm:hidden">
        <span class="text-red-600">NEW!</span> <ReactToAll />
      </p>
    </div>
    <UploadPost v-if="!isfetch && !posts.posted" :user="user" />
    <div
      v-if="!isfetch"
      v-for="post in posts"
      :key="post.id"
      class="flex flex-col justify-center items-center dark:text-white">
      <single-post-component-vue
        :post="post.posts[0]"
        class="mt-10"
        :user="post.user"
        v-if="post.posts.length == 1" />
      <Carousel :length="post.posts.length" v-else>
        <single-post-component-vue
          v-for="p in post.posts.reverse()"
          :key="p.id"
          :post="p"
          class="mt-10"
          :user="post.user" />
      </Carousel>
    </div>
    <div v-else class="grid h-screen place-items-center">
      <pulse-loader color="white"></pulse-loader>
    </div>
  </div>
  <!-- <UploadProfilePicture :user="user" /> -->
</template>
