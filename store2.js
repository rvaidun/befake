import { createStore } from "vuex";
import { event } from "vue-gtag";
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { Buffer } from "buffer";
import { generateSignature } from "../utils.js";
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
            if (Date.now() > localStorage.getItem("expiration")) {
                return fetch(
                    `${state.proxyUrl}/https://auth.bereal.team/token?grant_type=refresh_token`,
                    {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            grant_type: "refresh_token",
                            client_id: "android",
                            client_secret: "F5A71DA-32C7-425C-A3E3-375B4DACA406",
                            refresh_token: localStorage.getItem("refreshToken"),
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
            }
            else {
                return Promise.resolve(true);
            }
        },
        async getFriendsOfFriends({ commit, state, dispatch }) { },
        async getPosts({ commit, state, dispatch }) {
            return dispatch("refresh")
                .then(() => {
                    const t = generateSignature();
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
                            `${state.proxyUrl}/https://mobile.bereal.com/api/feeds/friends-v1`,
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
                                authorization:
                                    `Bearer ${localStorage.getItem("token")}` ?? "",
                                ...t
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
                    commit("error", err);
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
