<script>
import { defineComponent } from "vue";
import moment from "moment";

export default defineComponent({
  props: ["friend", "post"],
  // data() {
  //   return {
  //     nophoto:
  //       "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  //   };
  // },
  methods: {
    postdate() {
      return moment(this.post.creationDate._seconds * 1000).format(
        "MM-DD-YYYY h:mm:ss"
      );
    },
  },
  computed: {
    color() {
      var letters = "0123456789ABCDEF";
      var color = "";
      for (var i = 0; i < 6; i++) {
        color += letters[this.friend.username.charCodeAt(i) % 16];
      }
      return color;
    },
  },
});
</script>
<template>
  <a
    href="#"
    class="block p-6 max-w-5xl bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
  >
    <div class="flex flex-col ml-3">
      <div class="flex items-center justify-center">
        <img
          v-bind:src="
            friend.profilePicture
              ? friend.profilePicture.url
              : 'https://ui-avatars.com/api/?length=1' +
                '&name=' +
                friend.username +
                '&background=' +
                color
          "
          class="w-36 h-36 rounded-[50%]"
        />

        <span class="font-bold ml-3">
          {{ friend.fullname }}-{{ friend.username }}
        </span>
      </div>
      <div class="flex items-center justify-center">
        <img v-bind:src="post.photoURL" class="h-full ml-3 w-64 rounded-md" />
        <img
          v-bind:src="post.secondaryPhotoURL"
          class="h-full ml-3 w-64 rounded-md"
        />
      </div>
      <div class="flex items-center font-bold mt-2 justify-center">
        <span> {{ postdate() }} </span>
        <span class="ml-3">Retakes - {{ post.retakeCounter }}</span>
      </div>
      <div class="flex flex-col mt-4">
        <div
          v-for="e in post.realMojis"
          class="flex items-center justify-center"
        >
          <div class="relative">
            <img v-bind:src="e.uri" class="w-24 rounded-[50%]" />
            <span class="absolute top-[50px] left-[60px] text-5xl"
              >{{ e.emoji }}
            </span>
          </div>
          <span class="font-bold ml-4">{{ e.userName }}</span>
        </div>
      </div>
    </div>
  </a>
</template>
