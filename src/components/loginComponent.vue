<template>
  <div v-if="!sessionInfo">
    <div class="flex items-center justify-center mt-[25%]">
      <span class="mr-2"
        >Enter your phone number with country code and + or sync code:
      </span>
      <input
        type="text"
        placeholder="+11234567890"
        v-model="phone"
        class="border-black border-2 mr-2"
      />
      <button
        @click="sendCode"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Send
      </button>
    </div>
  </div>
  <div v-else>
    <div class="flex items-center justify-center mt-[25%]">
      <span class="mr-2">Enter your code: </span>
      <input
        type="text"
        placeholder="123456"
        v-model="code"
        class="border-black border-2 mr-2"
      />
      <button
        @click="verifyCode"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Verify
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { logicalExpression } from "@babel/types";
import { defineComponent } from "vue";
export default defineComponent({
  props: ["login"],
  data() {
    return {
      phone: "",
      sessionInfo: "",
      code: "",
    };
  },
  methods: {
    sendCode() {
      // if this.phone does not start with +
      if (!this.phone.startsWith("+")) {
        console.log("does not start with +");
        fetch("http://localhost:9000/loginwithcode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept-language": "en-US,en;q=0.9",
          },
          body: JSON.stringify({
            code: this.phone,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              localStorage.phone = data.phone;
              localStorage.expiration = data.expiration;
              localStorage.refreshToken = data.refreshToken;
              localStorage.token = data.token;
              this.login();
            }
          });
      } else {
        fetch(
          "https://arcane-woodland-79412.herokuapp.com/https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-firebase-client":
                "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone9,1 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/14.7.1 xcode/13F100",
              accept: "*/*",
              "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
              "x-firebase-client-log-type": "0",
              "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
              "accept-language": "en",
              "user-agent":
                "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
              "x-firebase-locale": "en",
            },
            body: JSON.stringify({
              phoneNumber: this.phone,
              iosReceipt:
                "AEFDNu9QZBdycrEZ8bM_2-Ei5kn6XNrxHplCLx2HYOoJAWx-uSYzMldf66-gI1vOzqxfuT4uJeMXdreGJP5V1pNen_IKJVED3EdKl0ldUyYJflW5rDVjaQiXpN0Zu2BNc1c",
              iosSecret: "KKwuB8YqwuM3ku0z",
            }),
          }
        )
          .then((res) => {
            console.log(res.status);
            return res.json();
          })
          .then((data) => {
            this.sessionInfo = data.sessionInfo;
          });
      }
    },
    verifyCode() {
      fetch(
        "https://arcane-woodland-79412.herokuapp.com/https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-firebase-client":
              "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone9,1 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/14.7.1 xcode/13F100",
            accept: "*/*",
            "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
            "x-firebase-client-log-type": "0",
            "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
            "accept-language": "en",
            "user-agent":
              "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
            "x-firebase-locale": "en",
          },
          body: JSON.stringify({
            sessionInfo: this.sessionInfo,
            code: this.code,
            operation: "SIGN_UP_OR_IN",
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          localStorage.phone = this.phone;
          localStorage.expiration =
            Date.now() + parseInt(data.expiresIn) * 1000;
          localStorage.refreshToken = data.refreshToken;
          localStorage.token = data.idToken;
          fetch("http://localhost:9000/savelogin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "accept-language": "en-US,en;q=0.9",
            },
            body: JSON.stringify({
              phone: this.phone,
              expiration: localStorage.expiration,
              refreshToken: localStorage.refreshToken,
              token: localStorage.token,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                localStorage.setItem("syncCode", data.syncCode);
              }
            });
          this.login();
        });
    },
  },
});
</script>
