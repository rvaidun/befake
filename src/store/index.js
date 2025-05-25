import { createStore } from "vuex";
import { event } from "vue-gtag";
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { Buffer } from "buffer";
import { getHeaders } from "../happyheaders";
const store = createStore({
  state() {
    return {
      proxyUrl: import.meta.env.VITE_PROXY_URL,
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
      console.error("Store error mutation:", payload);
      let errorMessage = "An error occurred.";
      if (payload instanceof Error) {
        errorMessage = payload.message;
      } else if (typeof payload === 'string') {
        errorMessage = payload;
      } else if (payload && payload.text) { // Assuming previous structure might pass an object
        errorMessage = payload.text;
      }

      state.error.text = errorMessage;
      state.error.show = true;
      setTimeout(() => {
        state.error.show = false;
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
        console.log("in refresh if");
        return fetch(
          `${state.proxyUrl}/https://securetoken.googleapis.com/v1/token?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q`,
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
          .then(async (res) => {
            if (!res.ok) {
              let errorData = await res.text();
              try {errorData = JSON.parse(errorData);} catch (e) {}
              console.error('API Error Response (securetoken.googleapis.com):', errorData);
              throw new Error(typeof errorData === 'string' ? errorData : (errorData.error?.message || errorData.message || res.statusText));
            }
            return res.json();
          })
          .then((tokendata) => {
            if (tokendata.error) { // Firebase token refresh can return 200 OK with error in body
              console.error("Firebase refresh token error:", tokendata.error);
              throw new Error(tokendata.error.message || "Failed to refresh Firebase token");
            }
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
                  client_secret: "F5A71DA-32C7-425C-A3E3-375B4DACA406", // Consider if this secret should be exposed client-side
                  token: tokendata.id_token,
                }),
              }
            )
              .then(async (res) => {
                if (!res.ok) {
                  let errorData = await res.text();
                  try {errorData = JSON.parse(errorData);} catch (e) {}
                  console.error('API Error Response (auth.bereal.team/token):', errorData);
                  throw new Error(typeof errorData === 'string' ? errorData : (errorData.message || res.statusText));
                }
                return res.json();
              })
              .then((data) => {
                if (data.error) { // Check for error in BeReal token exchange response body
                  console.error("BeReal token exchange error:", data.error);
                  throw new Error(data.error.message || data.error.type || "Failed to exchange Firebase token for BeReal token");
                }
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                localStorage.expiration =
                  Date.now() + parseInt(data.expires_in) * 1000;
                return true;
              });
          })
          .catch((err) => {
            console.error("Store action error (refresh):", err);
            commit("error", err); // Commit the error object or err.message
            // Optionally rethrow or return a rejected promise if calling code needs to know about failure
            // throw err; 
            return Promise.reject(err); // Ensure promise chain reflects failure
          });
      } else {
        return Promise.resolve(true);
      }
    },
    async getFriendsOfFriends({ commit, state, dispatch }) { },
    async getPosts({ commit, state, dispatch }) {
      return dispatch("refresh")
        .then(() => {
          const t = getHeaders();
          // console.log("asjdfaksjdfhkad", t);
          // console.log("successfully refreshed");
          // // make a new signature
          // const device_id = "937v3jb942b0h6u9asdfasdfa";
          // const tz = "America/Los_Angeles";
          // const key = import.meta.env.VITE_BEREAL_SECRET_KEY
          // // get current unix time in seconds
          // const unixtime = `${Math.floor(Date.now() / 1000)}`;
          // const data = `${device_id}${tz}${unixtime}`;
          // // base64 encode the data
          // const b64data = btoa(data);

          // // create a SHA256 HMAC with the signature and the key
          // const signature = hmacSHA256(b64data, key);
          // console.log(signature.toString())

          // const s2 = Buffer.concat([Buffer.from("1:"), Buffer.from(unixtime), Buffer.from(":"), Buffer.from(signature.toString(), "hex")]);
          // const s3 = s2.toString('base64');
          // console.log(s3)
          return Promise.all([
            fetch(
              `${state.proxyUrl}/https://mobile-l7.bereal.com/api/feeds/friends-v1`,
              {
                method: "GET",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
                  authorization:
                    `Bearer ${localStorage.getItem("token")}` ?? "",
                  ...t

                },
              }
            )
              .then(async (res) => {
                if (!res.ok) {
                  let errorData = await res.text();
                  try {errorData = JSON.parse(errorData);} catch (e) {}
                  console.error('API Error Response (feeds/friends-v1):', errorData);
                  throw new Error(typeof errorData === 'string' ? errorData : (errorData.message || "Error getting posts"));
                }
                return res.json();
              })
              .then((data) => {
                if (data.error) { // Check for error in friends-v1 response body
                  console.error("Friends feed error:", data.error);
                  throw new Error(data.error.message || "Failed to get friends feed");
                }
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
                authorization:
                  `Bearer ${localStorage.getItem("token")}` ?? "",
                ...t
              },
            })
              .then(async (res) => {
                if (!res.ok) {
                  let errorData = await res.text();
                  try {errorData = JSON.parse(errorData);} catch (e) {}
                  console.error('API Error Response (person/me):', errorData);
                  throw new Error(typeof errorData === 'string' ? errorData : (errorData.message || "Error getting user"));
                }
                return res.json();
              })
              .then((data) => {
                if (data.error) { // Check for error in person/me response body
                  console.error("Get user error:", data.error);
                  throw new Error(data.error.message || "Failed to get user details");
                }
                commit("user", data);
              }),
          ]);
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.error("Store action error (getPosts):", err);
          commit("error", err); // Commit the error object or err.message
          // throw err;  // Optionally rethrow
          return Promise.reject(err); // Ensure promise chain reflects failure
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
      }).then(async (res) => {
        if (!res.ok) {
          let errorData = await res.text();
          try {errorData = JSON.parse(errorData);} catch (e) {}
          console.error('API Error Response (deletePost):', errorData);
          commit("error", new Error(typeof errorData === 'string' ? errorData : (errorData.message || "Error deleting post")));
        } else {
          // res.ok path
          commit("setposted", false);
          dispatch("getPosts"); // This might also need more robust error handling if getPosts can fail
          event("post", "delete");
        }
      }).catch(err => { // Catch for network errors or if the above throw wasn't caught by a .then
          console.error("Store action error (deletePost):", err);
          commit("error", err);
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
        .then(async (res) => {
          if (!res.ok) {
            let errorData = await res.text();
            try {errorData = JSON.parse(errorData);} catch (e) {}
            console.error('API Error Response (getMemories):', errorData);
            throw new Error(typeof errorData === 'string' ? errorData : (errorData.message || "Error getting memories"));
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            console.error("Get memories error:", data.error);
            throw new Error(data.error.message || "Failed to get memories");
          }
          console.log(data); // Success case
          state.memories = data.data; // Assuming 'data.data' is correct structure for success
        })
        .catch(err => {
          console.error("Store action error (getMemories):", err);
          commit("error", err);
        });
    },
  },
});

export default store;
