<template>
  <div class="fixed bottom-0 left-0">
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong class="font-bold">Error! </strong>
      <span class="block sm:inline">{{ text }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["text"],
};
</script>
