import { createApp, VueElement } from "vue";
import Home from "./pages/Home.vue";
// import Graph from "./components/Graph.vue";
import "./index.css";
import App from "./App.vue";
import VueClipboard from "vue3-clipboard";
import { createRouter, createWebHistory } from "vue-router";
import VueGtag from "vue-gtag";
import { createStore } from "vuex";
const routes = [
  { path: "/", component: Home },
  // { path: "/graph", component: Graph },
];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

const store = createStore({
  state() {
    return {
      loggedIn: localStorage.getItem("token") ? true : false,
    };
  },
  mutations: {
    logout(state) {
      localStorage.clear();
      state.loggedIn = false;
    },
    login(state) {
      state.loggedIn = true;
    },
  },
});

const app = createApp(App);
app.use(store);
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
