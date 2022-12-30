import { createStore } from "vuex";
import { event } from "vue-gtag";
const store = createStore({
  state() {
    return {
      proxyUrl: "https://warm-scrubland-06418.herokuapp.com",
      // proxyUrl: "http://localhost:8080",
      loggedIn: localStorage.getItem("token") ? true : false,
      posts: [],
      user: {},
      error: {
        text: "",
        show: false,
      },
    };
  },
  mutations: {
    error(state, payload) {
      console.log("in error mutation");
      state.error.text = payload;
      state.error.show = true;
      setTimeout(() => {
        state.error.show = false;
        console.log("in error after timeout");
      }, 5000);
    },
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
    posts(state, posts) {
      state.posts = posts;
    },
  },
  actions: {
    async login({ commit, dispatch }) {
      dispatch("getUser");
      commit("login");
    },
    getPosts({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch(`${state.proxyUrl}/https://mobile.bereal.com/api/feeds/friends`, {
          method: "GET",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
            "accept-language": "en-US,en;q=0.9",
            authorization: localStorage.getItem("token") ?? "",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            // move user to the top of the list
            data.forEach(function (item, i) {
              if (item.ownerID === state.user.id) {
                data.splice(i, 1);
                data.unshift(item);
              }
            });
            commit("posts", data);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async getUser({ commit, state }) {
      await fetch(`${state.proxyUrl}/https://mobile.bereal.com/api/person/me`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
          "accept-language": "en-US,en;q=0.9",
          authorization: localStorage.getItem("token") ?? "",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          commit("user", data);
        });
    },
  },
});

export default store;
