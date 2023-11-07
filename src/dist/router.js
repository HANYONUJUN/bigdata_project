"use strict";
exports.__esModule = true;
var vue_router_1 = require("vue-router");
var MainComponent_vue_1 = require("./assets/components/MainComponent.vue");
var ArtComponent_vue_1 = require("./assets/components/ArtComponent.vue");
var routes = [
    {
        path: '/',
        name: 'Main',
        component: MainComponent_vue_1["default"]
    },
    {
        path: '/art',
        name: 'Art',
        component: ArtComponent_vue_1["default"]
    },
];
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(process.env.BASE_URL),
    routes: routes
});
exports["default"] = router;
