<template>
 <div id="selected_input">
  <select id="jsonFile" v-model="selectedFile">
      <option v-for="file in jsonFiles" :value="file">{{ file }}</option>
    </select>
    <label for="location">지역 검색:</label>
    <input id="location" v-model="searchQuery" placeholder="지역을 입력하세요" @keyup.enter="searchLocation" />
   <hr>
 </div>

  <div id="map" ref="map">
  <LMap :zoom="zoom" :center="center">
    <LTileLayer :url="url" :attribution="attribution" />
    <LMarker v-for="(marker, index) in markers" :key="index" :lat-lng="[marker.latitude, marker.longitude]"
    :style="{
      animation: 'bounce-in 0.5s',
      animationDelay: `${index * 0.1}s`
  }"
    >
      <LPopup>{{ marker.name }}</LPopup>
    </LMarker>
  </LMap>
</div>
<div id="street-view" ref="streetView"></div>
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
      searchQuery: '', // searchQuery 속성 추가
      selectedFile: '',
      jsonFiles: ['art_galleries.json'],
    };
  },
  watch: {
    selectedFile(newFile) {
      // 선택한 파일에 대한 로직 수행
      console.log('선택한 파일:', newFile);
      // 선택한 파일을 사용하여 필요한 작업 수행
    },
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
  const selectedFilePath = `/api_json/${this.selectedFile}`;
  axios
    .get(selectedFilePath)
    .then((response) => {
      const data = response.data;
      const markers: Marker[] = [];
      data.forEach((item: any) => {
        if (item.latitude !== undefined && item.longitude !== undefined) {
           markers.push({
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
            });
         }
       });
        this.markers = markers;
      })
        .catch((error) => console.error(error));
    },


    searchLocation() {
      const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${this.searchQuery}&limit=1&appid=MY_API_KEY`;
      axios
        .get(geocodingApiUrl)
        .then((response) => {
          if (response.data.length > 0) {
            const location = response.data[0];
            this.center = [location.lat, location.lon];
            this.getData();
          } else if (response.data.length === null){
            console.error('검색된 결과가 없습니다.');
          }
        })
        .catch((error) => console.error(error));
    },
  },
});
</script>
  
<style lang="scss">
@import "../reaction/utils";

$breakpoint-mobile: 768px;
$breakpoint-desktop: 1024px;

  #map{
    height: 680px;
    border: 1px solid black;
  }
  @keyframes bounce-in {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

// 모바일용 스타일
@include mobile {
  #map {
    height: 550px;
  }
  #selected_input {
     display: inline-block;
     .input{
        width: 130px;
     }
  }
}
</style>