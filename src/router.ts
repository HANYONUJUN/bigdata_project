import { createRouter, createWebHistory } from "vue-router";
import Main from './assets/components/MainComponent.vue'
import Art from './assets/components/ArtComponent.vue'

const routes = [
  
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  
  
  {
    path: '/art',
    name: 'Art',
    component: Art
  },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;