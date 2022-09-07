<script>
import { defineComponent } from "vue";
import moment from "moment";

export default defineComponent({
  props: ["friend", "post"],
  data() {
    return {
      iframesrc: this.post.location
        ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyDPvCQ4RXgvhbboTmKh2qLnfY50aJxcD0E&q=${this.post.location._latitude}, ${this.post.location._longitude}`
        : "",
    };
  },
  methods: {
    postdate() {
      return moment(this.post.creationDate._seconds * 1000).format(
        "MM-DD-YYYY h:mm:ss"
      );
    },
    replacebydef(e) {
      console.log("Hi");
      fetch(
        `https://arcane-woodland-79412.herokuapp.com/https://mobile.bereal.com/api/person/profiles/${this.friend.id}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
            accept: "*/*",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          e.target.src = data.profilePicture.url;
        });
    },
    boldusername(s) {
      return s.replace(
        /@\w+/g,
        "<span class='font-bold text-blue-200'>$&</span>"
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
  <div
    class="block p-6 w-[90%] sm:w-auto bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
  >
    <div class="flex flex-col">
      <div class="flex items-center sm:justify-center">
        <img
          referrerpolicy="no-referrer"
          v-bind:src="
            friend.profilePicture
              ? friend.profilePicture.url
              : 'https://ui-avatars.com/api/?length=1' +
                '&name=' +
                friend.username +
                '&background=' +
                color
          "
          class="w-28 rounded-[50%]"
          @error="
            'https://ui-avatars.com/api/?length=1' +
              '&name=' +
              friend.username +
              '&background=' +
              color
          "
        />

        <span class="font-bold ml-3">
          {{ friend.fullname }}-{{ friend.username }}
        </span>
        <iframe
          class="ml-3"
          width="400"
          height="300"
          style="border: 0"
          loading="lazy"
          v-if="post.location"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          :src="iframesrc"
        >
        </iframe>
      </div>
      <div class="flex items-center justify-center flex-col mt-4 sm:flex-row">
        <img
          referrerpolicy="no-referrer"
          v-bind:src="post.photoURL"
          class="h-full ml-3 w-64 rounded-md mb-3"
        />
        <img
          referrerpolicy="no-referrer"
          v-bind:src="post.secondaryPhotoURL"
          class="h-full ml-3 w-64 rounded-md"
        />
      </div>
      <div class="flex items-center font-bold mt-2 justify-center">
        <span> {{ postdate() }} </span>
        <span class="ml-3">Retakes - {{ post.retakeCounter }}</span>
      </div>
      <div class="flex flex-col">
        <span v-if="post.caption">
          <span class="font-bold">{{ friend.username + ": " }} </span>
          {{ post.caption }}
        </span>
      </div>
      <div v-if="post.comment" class="flex flex-col">
        <div v-for="c in post.comment">
          <span class="font-bold"> {{ c.userName + ": " }}</span>
          <span v-html="boldusername(c.text)"></span>
        </div>
      </div>

      <div class="flex flex-col mt-4 ml-[25%]">
        <div v-for="e in post.realMojis" class="flex items-center mb-2">
          <div class="relative">
            <img
              referrerpolicy="no-referrer"
              v-bind:src="e.uri"
              class="w-24 rounded-[50%]"
            />

            <span class="absolute top-[50px] left-[60px] text-5xl"
              >{{ e.emoji }}
            </span>
          </div>
          <span class="font-bold ml-4">{{ e.userName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
