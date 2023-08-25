import { createStore } from "vuex";
import { event } from "vue-gtag";
const store = createStore({
  state() {
    return {
      proxyUrl: "http://localhost:8080", // cors-anywhere server
      // proxyUrl: "/proxy",
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
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user_id");
      localStorage.removeItem("fbrefreshtoken");
      localStorage.removeItem("fbtoken");
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
      console.log("in refresh");
      if (Date.now() > localStorage.getItem("expiration")) {
        console.log("in refresh if");
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
              refresh_token: localStorage.getItem("fbrefreshtoken"),
            }),
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw Error(res.statusText);
            }
            return res.json();
          })
          .then((tokendata) => {
            localStorage.setItem("fbrefreshtoken", tokendata.refresh_token);
            localStorage.setItem("fbtoken", tokendata.id_token);
            localStorage.setItem("user_id", tokendata.user_id);
            return fetch(
              `${state.proxyUrl}/https://auth.bereal.team/token?grant_type=firebase`,
              {
                method: "POST",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
                  "accept-language": "en-US,en;q=0.9",
                },
                body: JSON.stringify({
                  grant_type: "firebase",
                  client_id: "android",
                  client_secret: "F5A71DA-32C7-425C-A3E3-375B4DACA406",
                  token: tokendata.id_token,
                }),
              }
            )
              .then((res) => {
                if (!res.ok) {
                  throw Error(res.statusText);
                }
                return res.json();
              })
              .then((data) => {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                localStorage.expiration =
                  Date.now() + parseInt(data.expires_in) * 1000;
                return true;
              });
          })
          .catch((err) => {
            console.log("error while refreshing");
            console.log(err);
          });
      } else {
        return Promise.resolve(true);
      }
    },
    async getPosts({ commit, state, dispatch }) {
      return dispatch("refresh")
        .then(() => {
          console.log("successfully refreshed");
          return Promise.all([
            fetch(
              `${state.proxyUrl}/https://mobile.bereal.com/api/feeds/friends-v1`,
              {
                method: "GET",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
                  "accept-language": "en-US,en;q=0.9",
                  authorization:
                    `Bearer ${localStorage.getItem("token")}` ?? "",
                },
              }
            )
              .then((res) => {
                if (!res.ok) throw new Error("Error getting posts");
                return res.json();
              })
              .then((data) => {
                // reverse data.friendsPosts
                data.friendsPosts.reverse();
                // for each post in data.friendsPosts reverse the posts
                // data.friendsPosts.forEach((post) => {
                //   post.posts.reverse();
                // });
                // if data.userPosts exist and data.friendsPosts exist and data.friendsPosts.length > 0 then prepend the userPosts object to the friendsPosts array
                if (data.userPosts && data.friendsPosts) {
                  data.friendsPosts.unshift(data.userPosts);
                }

                commit("posts", data.friendsPosts);
              }),
            fetch(`${state.proxyUrl}/https://mobile.bereal.com/api/person/me`, {
              method: "GET",
              headers: {
                accept: "application/json",
                "content-type": "application/json",
                "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
                "accept-language": "en-US,en;q=0.9",
                authorization: `Bearer ${localStorage.getItem("token")}` ?? "",
              },
            })
              .then((res) => {
                if (!res.ok) throw new Error("Error getting user");
                return res.json();
              })
              .then((data) => {
                commit("user", data);
              }),
          ]);
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          reject(err);
        });
    },
    async getUser({ commit, state, dispatch }) {
      // const x = await dispatch("refresh");
      // if (!x) return Promise.reject("error refreshing the token");
      // return dispatch("refresh").then((res) => {
      //   // fetch(`${state.proxyUrl}/https://mobile.bereal.com/api/person/me`, {
      //   //   method: "GET",
      //   //   headers: {
      //   //     accept: "application/json",
      //   //     "content-type": "application/json",
      //   //     "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
      //   //     "accept-language": "en-US,en;q=0.9",
      //   //     authorization: localStorage.getItem("token") ?? "",
      //   //   },
      //   // })
      //   //   .then((res) => res.json())
      //   //   .then((data) => {
      //   //     commit("user", data);
      //   //   });
      // });
    },
    async deletePost({ commit, state, dispatch }) {
      fetch(`${state.proxyUrl}/https://mobile.bereal.com/api/content/posts`, {
        method: "DELETE",
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
      }).then((res) => {
        if (res.ok) {
          commit("setposted", false);
          dispatch("getPosts");
          event("post", "delete");
        } else {
          commit("error", "Error deleting post");
        }
      });
    },
    async getMemories({ commit, state, dispatch }) {
      fetch(`${state.proxyUrl}/https://mobile.bereal.com/api/feeds/memories`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
          authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          "accept-language": "en-US,en;q=0.9",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          state.memories = data.data;
        });
    },
  },
});

export default store;
