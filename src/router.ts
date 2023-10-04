import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path:'/',
        redirect: '/main',
    }
    ,
   { 
        path: "/mylocation",
        component: () => import("../src/assets/components/MyLocation.vue"),
   },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;