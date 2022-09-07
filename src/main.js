import { createApp, VueElement } from "vue";
import Home from "./components/Home.vue";
import Graph from "./components/Graph.vue";
import "./index.css";
import App from "./App.vue";
import VueClipboard from "vue3-clipboard";
import { createRouter, createWebHistory } from "vue-router";
import VueGtag from "vue-gtag";
const routes = [
  { path: "/", component: Home },
  { path: "/graph", component: Graph },
];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

const app = createApp(App);
app.use(router);
app.use(
  VueGtag,
  {
    config: { id: "G-ZJ1LQLNXRG" },
  },
  router
);
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
});
app.mount("#app");
