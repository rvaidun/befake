<script>
import MyInput from "../components/ui/Input.vue";
import MyButton from "../components/ui/Button.vue";
export default {
  components: { MyInput, MyButton },
  data() {
    return {
      username: "",
    };
  },
  methods: {
    search() {
      console.log("Here");
    },
  },
};
</script>
<template>
  <div class="flex flex-col items-center m-10">
    <div class="flex items-center">
      <MyInput
        v-model="username"
        placeholder="Comment"
        class="w-96"
        @enter="search" />
      <MyButton @click="search">Search</MyButton>
    </div>
  </div>
</template>
