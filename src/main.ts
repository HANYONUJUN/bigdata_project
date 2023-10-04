import { createApp } from 'vue'
import App from '../src/assets/components/main.vue';
import "./assets/scss/main.scss";
import 'leaflet/dist/leaflet.css';
import router from  "./router";

createApp(App).use(router).mount('#app');





