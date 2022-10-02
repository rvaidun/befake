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
    user(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }) {
      await fetch(
        "https://warm-scrubland-06418.herokuapp.com/https://mobile.bereal.com/api/person/me",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
            "accept-language": "en-US,en;q=0.9",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          commit("user", data);
        });
      commit("login");
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
