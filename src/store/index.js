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
      userPosted: false,
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
    setposted(state, posted) {
      state.userPosted = posted;
    },
  },
  actions: {
    async login({ commit, dispatch }) {
      dispatch("getUser");
      commit("login");
    },
    refresh({ commit, state }) {
      if (Date.now() > localStorage.getItem("expiration")) {
        return fetch(
          `${state.proxyUrl}/https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-firebase-client":
                "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone13,2 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/15.5 xcode/13F100",
              accept: "*/*",
              "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
              "x-firebase-client-log-type": "0",
              "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
              "accept-language": "en",
              "user-agent":
                "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/15.5 hw/iPhone13_2",
              "x-firebase-locale": "en",
            },
            body: JSON.stringify({
              grant_type: "refresh_token",
              refresh_token: localStorage.getItem("refreshToken"),
            }),
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem(
              "expiration",
              Date.now() + data.expires_in * 1000
            );
            localStorage.setItem("refreshToken", data.refresh_token);
            return Promise.resolve(true);
          })
          .catch((err) => {
            console.log(err);
            localStorage.clear();
            commit("logout");
            return Promise.reject(false);
          });
      } else {
        return Promise.resolve(true);
      }
    },
    async getPosts({ commit, state, dispatch }) {
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
            for (let i = 0; i < data.length; i++) {
              if (data[i].ownerID === state.user.id) {
                // remove i and move to top
                let user = data.splice(i, 1);
                console.log(user);
                data.unshift(user[0]);
                data.posted = true;
                break;
              }
            }
            commit("posts", data);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async getUser({ commit, state, dispatch }) {
      const x = await dispatch("refresh");
      if (!x) return Promise.reject("error refreshing the token");
      return dispatch("refresh").then((res) => {
        fetch(`${state.proxyUrl}/https://mobile.bereal.com/api/person/me`, {
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
      });
    },
    async deletePost({ commit, state, dispatch }) {
      fetch(
        `https://us-central1-alexisbarreyat-bereal.cloudfunctions.net/deleteBeReal`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
            "accept-language": "en-US,en;q=0.9",
            authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
          body: JSON.stringify({
            data: {
              uid: state.user.id,
            },
          }),
        }
      ).then((res) => {
        if (res.status / 100 === 2) {
          commit("setposted", false);
          dispatch("getPosts");
          event("post", "delete");
        } else {
          commit("error", "Error deleting post");
        }
      });
    },
  },
});

export default store;
