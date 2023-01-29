import { createApp } from "vue";
import { createPinia } from "pinia";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import Layui from "@layui/layui-vue";
import "@layui/layui-vue/lib/index.css";

import App from "./App.vue";
import router from "./router";

import "normalize.css";
import "./assets/main.css";

import "@/socket";
import "@/client";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(Layui);

app.mount("#app");
