<template>
 <div class="selected_input">
  <span id="json_title">예술공간:</span>

  <select id="jsonFile" v-model="selectedFile">
      <option v-for="file in jsonFiles" :value="file">{{ file }}</option>
  </select>

  <span id="location_title">지역 검색:</span> 
    <input id="location" v-model="searchQuery" placeholder="지역을 입력하세요" @keyup.enter="searchLocation" />
</div>
 <hr>

 <div id="map" ref="map">
  <LMap :zoom="zoom" :center="center">
    <LTileLayer :url="url" :attribution="attribution" />
      <LMarker v-for="(marker, index) in markers" :key="index" :lat-lng="[marker.latitude, marker.longitude]"
        :style="{
        animation: 'bounce-in 0.5s',
        animationDelay: `${index * 0.1}s`
      }"
      @click="showBuildingPhoto(marker)">

        <LPopup id="pop-up">
          {{ marker.name }}<br>
          {{ marker.tel }}<br>
          <a :href="marker.home" target="_blank">{{ marker.home }}</a><br>
          <img :src="marker.streetViewImageUrl" id="streetview-image"/>
        </LPopup>
      </LMarker>
    </LMap>
  </div>

  <div class="meun_bar">
    <button type="button" @click="goback" id="back-btn">
      <i class="bi bi-house-door"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import '../scss/art.scss';
import useArtData from '../data/useData'; 

export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },

  setup() {
    const artData = useArtData();

    return{
      ...artData,
    }
  }

});
</script>