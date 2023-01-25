<script>

export default {
  data() {
    return {
      realmojiData: null,
      ownData: false,
      emojiData: null
    }
  },
  props: ["file", "imageurl", "realmoji", "own", "emoji", "postID"],
  created() {
    this.realmojiData = this.realmoji
    try {
      this.realmojiData.uri = this.realmojiData.media.url
    } catch (error) {
      
    }
    
    this.ownData = this.own == undefined ? false : true
    this.emojiData = this.emoji
  }
}
</script>
<template>
  <div class="relative mr-6">
    <div v-if="ownData == false" class="flex items-center m-auto mb-2">
      <div>
        <img
          referrerpolicy="no-referrer"
          v-bind:src="realmojiData.uri"
          class="w-24 rounded-[50%]" />

        <span class="absolute top-[50px] left-[60px] text-5xl"
          >{{ realmojiData.emoji }}
        </span>
      </div>
      <span v-if="realmojiData.userName != ''" class="font-bold ml-4 mr-4">{{ realmojiData.userName }}</span>
    </div>
  <div v-else-if="realmojiData != null">
    <button @click="$emit('clicked')">
      <img
        referrerpolicy="no-referrer"
        v-bind:src="realmojiData.uri"
        class="w-24 rounded-[50%]" />
    </button>

      <span v-if="realmojiData.emoji != ''" class="absolute top-[50px] left-[60px] text-5xl"
        >{{ realmojiData.emoji }}
      </span>
  </div>
  <div class="border-white w-24 h-24 rounded-[50%] border-2 cursor-pointer" v-else>
    <label :for="emojiData + postID">
    <div>
      <div v-if="file == null">
        <input
          type="file"
          :id="emojiData + postID"
          style="display: none"
          :name="emojiData"
          @change="(e) => {$emit('fileChanged', e, emojiData)}" />
        <svg
          class="w-24 h-24 rp"
          width="107"
          height="107"
          viewBox="0 0 107 107"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect
            x="18.3429"
            y="45.8571"
            width="69.8048"
            height="15.2857"
            fill="white" />
          <rect
            x="45.8571"
            y="88.1476"
            width="69.8048"
            height="15.2857"
            transform="rotate(-90 45.8571 88.1476)"
            fill="white" />
        </svg>
      </div>
      <div v-else class="cursor-pointer">
        <button @click="$emit('clickedd')">
          <img :src="imageurl" class="w-24 rounded-[50%]" />
        </button>
      </div>
      <span class="absolute top-[50px] left-[60px] text-5xl"
          >{{ emojiData }}
      </span>
    </div>
    </label>
  </div>
  </div>
 
</template>
