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

    <button type="button" @click="weatherModal" id="weather-btn">
      <i class="bi bi-brightness-high"></i>
    </button>
  </div>

  
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <div id="data_text">
      <h2 v-if="currentMarker">{{ currentMarker.name }}</h2>
      <p v-if="currentMarker">{{ currentMarker.tel }}</p>
      <a v-if="currentMarker" :href="currentMarker.home" target="_blank">{{ currentMarker.home }}</a>
      <img v-if="currentMarker" :src="currentMarker.streetViewImageUrl" id="streetview-image"/>
    </div>
  </div>
</div>

  <div v-if="showInfoModal" class="info-modal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <div class="info-content">
        <h2>사용방법</h2>
        <p>1. 지도에서 원하는 위치를 검색하세요.</p>
        <p>2. 선택한 위치에 마커가 표시됩니다.</p>
        <p>3. 마커를 클릭하면 해당 장소의 정보를 확인할 수 있습니다.</p>
        <p>4. 모달 창을 닫으려면 X 버튼을 클릭하세요.</p>
      </div>
    </div>
  </div>

  <div v-if="showWeatherModal" class="weather-modal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <div class="info-content">
        <h2>현재 날씨</h2>
          <div v-if="currentMarker" id="weather">
          <img :src="currentMarker.weatherIcon"><br>
          <span>{{ currentMarker.temperature }}°C</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup, LPolyline} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import '../scss/art.scss';
import useArtData from '../data/useData'; 


export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
  },

  setup() {
    const artData = useArtData();

    return{
      ...artData,
    }
  }
});
</script>