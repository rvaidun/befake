<script>
import MyInput from "../components/ui/Input.vue";
import MyButton from "../components/ui/Button.vue";
export default {
  components: { MyInput, MyButton },
  data() {
    return {
      username: "",
      profiles: [],
      nonefound: false,
    };
  },
  methods: {
    search() {
      fetch(
        `${this.$store.state.proxyUrl}/https://mobile.bereal.com/api/search/profile?query=${this.username}&limit=20`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            // accept: "*/*",
            // "bereal-platform": "iOS",
            // "bereal-os-version": "14.7.1",
            // "accept-language": "en-US;q=1.0",
            // "bereal-device-id": "BE707B57-FDF8-4764-87FB-96367BB32018",
            // "bereal-app-language": "en-US",
            // "user-agent":
            //   "BeReal/0.28.2 (AlexisBarreyat.BeReal; build:8425; iOS 14.7.1) 1.0.0/BRApiKit",
            // "bereal-timezone": "America/Los_Angeles",
            // "bereal-device-language": "en",
            // "bereal-app-version": "0.28.2-(8425)",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          this.profiles = res.data;
          this.nonefound = res.data.length === 0;
        });
    },
  },
};
</script>
<template>
  <div class="flex flex-col items-center m-10">
    <div class="flex items-center">
      <MyInput
        v-model="username"
        placeholder="Username"
        typeOfInput="text"
        class="w-96"
        @enter="search" />
      <MyButton @click="search">Search</MyButton>
    </div>
    <div class="flex flex-col items-center">
      <div v-if="nonefound">
        <div class="text-2xl text-red-800">No users found</div>
      </div>
      <div v-for="i in profiles" :key="i.id">
        <div class="flex items-center gap-3">
          <img
            :src="
              i.profilePicture
                ? i.profilePicture.url
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQotrbW-vxBRCZIOODdVJZ5NTaTjOnFveV500Dve9g&s'
            "
            class="w-24 h-24 rounded-[50%]"
            alt="prof_pic" />
          <div class="flex flex-col">
            <div class="text-2xl">{{ i.username }}</div>
            <div class="text-xl">{{ i.mutualFriends }} mutual friends</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
