<template>
    <div id="container">
      <div class="main_title" id="section" data-bgcolor="#364652">
        <h1>안녕하세요</h1>
      </div>
    
      <div class="map_sample_line"></div>
      
      <div class="map" id="section" data-bgcolor="#f6f5f7"> 
        <div class="map_border"> 
          <div class="map">
            <l-map :zoom="zoom" :center="center">
              <l-tile-layer :url="url"></l-tile-layer>
                <l-marker :lat-lng="center">
                  <l-popup>여기는 서울입니다!</l-popup>
                </l-marker>
            </l-map>      
        </div>
      </div>
    </div>
    
      <div class="map_writing">
        <h2 id="h_line_1">지도를 통해서 각 예술 활동에 대한</h2>
        <h2 id="h_line_2">위치와 정보를 확인해보세요!</h2>
      </div>
    
      <div class="next_btn">
        <button type="button">시작하기</button>
        <router-link to="/mylocation">go</router-link>
      </div>
    </div>
    
    </template>
    
    
    <script lang="ts">
    import { defineComponent } from 'vue';
    import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
    import 'leaflet/dist/leaflet.css';
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
        };
      }
    });
    
    </script>