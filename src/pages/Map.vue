<style>
.vue-map-container img[src*="https://cdn.bereal.network/Photos"]
{
  border-radius: 50%;
}
.vue-map-containe img[src*="ui-avatars.com"] {
  border-radius: 50%;
}
</style>
<template>
  <GMapMap
    :center="center"
    :zoom="4"
    map-type-id="terrain"
    style="height: 100vh"
    :options="mapStyles">
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
import sha256 from "js-sha256";
export default {
  name: "App",
  data() {
    return {
      mapStyles: {
        styles: [
          {
            elementType: "geometry",
            stylers: [
              {
                color: "#242f3e",
              },
            ],
          },
          {
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#746855",
              },
            ],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#242f3e",
              },
            ],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#d59563",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#d59563",
              },
            ],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [
              {
                color: "#263c3f",
              },
            ],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#6b9a76",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              {
                color: "#38414e",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#212a37",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#9ca5b3",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              {
                color: "#746855",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#1f2835",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#f3d19c",
              },
            ],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [
              {
                color: "#2f3948",
              },
            ],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#d59563",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              {
                color: "#17263c",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#515c6d",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#17263c",
              },
            ],
          },
        ],
      },
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
        console.log(post);
        return {
          position: {
            lat: post.location._latitude,
            lng: post.location._longitude,
            // gravatar identicon
          },
          pic: post.user.profilePicture
            ? post.user.profilePicture.url
            : `https://ui-avatars.com/api/?length=1&name=${
                post.user.username
              }&background=${sha256(post.user.username).substring(0, 3)}`,
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
