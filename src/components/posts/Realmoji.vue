<script setup>
defineProps({
  realmoji: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <img
        referrerpolicy="no-referrer"
        v-bind:src="realmoji.media.url"
        class="w-full rounded-[50%]"
        alt="realmoji" />

      <span class="absolute bottom-0 right-0 text-2xl md:text-4xl"
        >{{ realmoji.emoji }}
      </span>
    </div>
    <span class="font-bold ml-4">{{ realmoji.user.username }}</span>
  </div>
</template>
