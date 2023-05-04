<script>
export default {
  props: ["realmoji"],
};
</script>
<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <img
        referrerpolicy="no-referrer"
        v-bind:src="realmoji.media.url"
        class="w-24 rounded-[50%]"
        alt="realmoji" />

      <span class="absolute top-[50px] left-[60px] text-2xl"
        >{{ realmoji.emoji }}
      </span>
    </div>
    <span class="font-bold ml-4">{{ realmoji.userName }}</span>
  </div>
</template>
