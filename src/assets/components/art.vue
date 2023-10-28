<template>
  <div id="map" ref="map">
  <LMap :zoom="zoom" :center="center">
    <LTileLayer :url="url" :attribution="attribution" />
    <LMarker v-for="marker in markers" :key="marker.name" :lat-lng="markerLatLng(marker)">
      <LPopup>{{ marker.name }}</LPopup>
    </LMarker>
  </LMap>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

interface Marker {
  name: string;
  latitude: number;
  longitude: number;
}

export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },

  data() {
    return {
      zoom: 13,
      center: [37.5665, 126.9780],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Map data &copy; OpenStreetMap contributors',
      markers: [] as Marker[],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      axios
        .get('/api_json/art_galleries.json')
        .then((response) => {
          const data = response.data;

          // 필요한 정보 추출 및 처리
          const markers: Marker[] = data.map((item: any) => ({
            name: item.name,
            latitude: item.latitude,
            longitude: item.longitude,
          }));
          this.markers = markers;
        })
        .catch((error) => console.error(error));
    },

    markerLatLng(marker: Marker) {
      return [marker.latitude, marker.longitude];
    },
  },
});
</script>
  
<style>
  #map{
    height: 700px;
  }
</style>