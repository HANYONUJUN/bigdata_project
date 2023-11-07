<template>
  <div id="container">

    <div class="back_img">
      <img src="../img/back.png">
    
    
    <div class="main_img">
       <img src="../img/human.png">
    </div>

    <div class="map_writing">
      <h2 id="h_line_1">지도를 통해서 각 예술 활동에 대한</h2>
      <h2 id="h_line_2">위치와 정보를 확인해보세요!</h2>
    </div>

    <div class="d_down">
      <i class="bi bi-chevron-double-down"></i>
   </div>


    <div class="next_btn">
      <button type="button" @click="goToArt">시작하기</button>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '../scss/main.scss';

export default defineComponent({
  methods: {
    goToArt() {
      this.$router.push({ name: 'Art' });
    },
  },
});
</script>
