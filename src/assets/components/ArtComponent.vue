<template>
 <div class="selected_input">
  <div class="selected_input_content">
  <span id="json_title"></span>
  <i class="bi bi-building" id="building"></i>
  <select id="jsonFile" v-model="selectedFile">
     <option v-for="file in jsonFiles" :value="file">{{ file.replace('.json', '') }}</option>
  </select>

  <i class="bi bi-compass"></i>
  <span id="location_title"></span> 
    <input id="location" v-model="searchQuery" placeholder="지역 검색" @keyup.enter="searchLocation" />
  </div>
</div>

 <div id="map" ref="map">
  <LMap :zoom="zoom" :center="center">
    <LTileLayer :url="url" :attribution="attribution" />
      <LMarker 
        v-for="(marker, index) in markers" 
        :key="index" 
        :lat-lng="[marker.latitude, marker.longitude]"
        :style="{
        animation: 'bounce-in 0.5s',
        animationDelay: `${index * 0.1}s`
      }"
      @click="saveMarkerData(marker)">

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

    <button type="button" @click="openModal" id="modal-btn">
      <i class="bi bi-geo-alt"></i>
    </button>

    <button type="button" @click="infoModal" id="info-btn">
      <i class="bi bi-info-circle"></i>
    </button>
  </div>

  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h2 v-if="currentMarker">{{ currentMarker.name }}</h2>
      <p v-if="currentMarker">{{ currentMarker.tel }}</p>
      <a v-if="currentMarker" :href="currentMarker.home" target="_blank">{{ currentMarker.home }}</a>
      <img v-if="currentMarker" :src="currentMarker.streetViewImageUrl" id="streetview-image"/>
    </div>
  </div>

  <div v-if="showInfoModal" class="info-modal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <div class="info-content">
        <h2>사용방법</h2>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import '../scss/art.scss';
import useArtData from '../data/useData'; 
import { marker } from 'leaflet';
import { Marker } from '@vue-leaflet/vue-leaflet/dist/src/functions';

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