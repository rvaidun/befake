<style>
img[src*="https://cdn.bereal.network/cdn-cgi"]
{
  border-radius: 50%;
}
</style>
<template>
  <GMapMap
    :center="center"
    :zoom="4"
    map-type-id="terrain"
    style="height: 100vh">
    <GMapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="false"
      :icon="{
        url: m.pic,
        scaledSize: { width: 50, height: 50 },
      }"
      @click="
        center = m.position;
        openMarker(index);
      ">
      <GMapInfoWindow
        :closeclick="true"
        @closeclick="openMarker(null)"
        :opened="openedMarkerID === index">
        <singlePostComponent :post="m.post" class="" />
      </GMapInfoWindow>
    </GMapMarker>
  </GMapMap>
</template>
<script>
import singlePostComponent from "../components/posts/singlePostComponent.vue";
export default {
  name: "App",
  data() {
    return {
      openedMarkerID: null,
      center: { lat: 0, lng: 0 },
      markers: [],
    };
  },
  async beforeMount() {
    await this.$store.dispatch("getPosts");
    this.markers = this.$store.state.posts
      .filter((p) => p.location)
      .map((post) => {
        console.log(post.user.profilePicture.url);
        return {
          position: {
            lat: post.location._latitude,
            lng: post.location._longitude,
          },
          pic: post.user.profilePicture.url,
          post: post,
        };
      });
    // find the center of lat and lng for markers and make this the center

    this.markers.forEach((m) => {
      this.center.lat += m.position.lat;
      this.center.lng += m.position.lng;
    });
    this.center.lat /= this.markers.length;
    this.center.lng /= this.markers.length;
    console.log(this.markers);
  },
  methods: {
    openMarker(id) {
      this.openedMarkerID = id;
    },
  },
  components: {
    singlePostComponent,
  },
};
</script>
