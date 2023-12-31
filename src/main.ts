import { createApp } from 'vue'
import router from './router'
import App from './App.vue';
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'


createApp(App).use(router).use(BootstrapVue3)


.mount('#app')





