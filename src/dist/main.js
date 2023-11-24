"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var router_1 = require("./router");
var App_vue_1 = require("./App.vue");
var bootstrap_vue_3_1 = require("bootstrap-vue-3");
require("bootstrap-vue-3/dist/bootstrap-vue-3.css");
require("bootstrap-icons/font/bootstrap-icons.css");
vue_1.createApp(App_vue_1["default"]).use(router_1["default"]).use(bootstrap_vue_3_1["default"])
    .mount('#app');
