<script>
import { defineComponent } from "vue";
import moment from "moment";

export default defineComponent({
  props: ["friend", "post"],
  data() {
    return {
      nophoto:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    };
  },
  methods: {
    postdate() {
      return moment(this.post.creationDate._seconds * 1000).format(
        "MM-DD-YYYY h:mm:ss"
      );
    },
  },
});
</script>
<template>
  <div class="flex flex-col ml-3">
    <div class="flex items-center">
      <img
        v-bind:src="friend.profilePicture ? friend.profilePicture.url : nophoto"
        class="w-36 h-36 rounded-[50%]"
      />
      <span class="font-bold ml-3">
        {{ friend.fullname }}-{{ friend.username }}
      </span>
      <img v-bind:src="post.photoURL" class="h-full ml-3 w-64" />
      <img v-bind:src="post.secondaryPhotoURL" class="h-full ml-3 w-64" />
    </div>
    <div class="flex items-center font-bold mt-2">
      <span> {{ postdate() }} </span>
      <span class="ml-3">Retakes - {{ post.retakeCounter }}</span>
    </div>
    <div class="flex flex-col">
      <div v-for="e in post.realMojis" class="flex items-center">
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
</template>
