<template>
  <div v-if="!sessionInfo">
    <div class="text-center text-white pt-10">
      <h1 class="font-bold mt-0 mb-6 text-7xl">BeFake</h1>
      <h3 class="text-2xl font-bold mb-8">A BeReal Viewer</h3>
      <span class="text-xl font-bold text-red-700">
        BeFake is down. Please be patient my host for my CORS anywhere proxy
        removed the free tier and I am currently looking for another host.
        <br />
      </span>
    </div>
    <div
      class="flex items-center justify-center mt-[75%] flex-col sm:flex-row sm:mt-[15%]"
    >
      <VueCountryCode @asdfasdf="setCountryCode" class="max-w-[100px]" />
      <!-- <input
        type="text"
        placeholder="Phone Number"
        v-model="phone"
        class="border-black border-2 mr-2"
      /> -->
      <MyInput v-model="phone" placeholder="Phone Number" class="max-w-sm" />
      <MyButton @clickedd="sendCode" :loading="loading">Send</MyButton>
    </div>
  </div>

  <div v-else>
    <div
      class="flex items-center justify-center mt-[75%] flex-col sm:flex-row sm:mt-[25%]"
    >
      <span class="mr-2 dark:text-white"
        >Enter the OTP sent to your phone number:
      </span>
      <MyInput v-model="code" placeholder="123456" class="max-w-sm" />
      <MyButton @clickedd="verifyCode" :loading="loading">Verify</MyButton>
    </div>
  </div>
</template>
<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import MyButton from "../components/ui/Button.vue";
import VueCountryCode from "../components/login/countrypicker.vue";
import MyInput from "../components/ui/Input.vue";

import { event } from "vue-gtag";
export default {
  components: { PulseLoader, MyButton, VueCountryCode, MyInput },
  props: ["login"],
  data() {
    return {
      cc: "+1",
      phone: "",
      sessionInfo: "",
      code: "",
      loading: false,
    };
  },
  methods: {
    handleError(message) {
      this.$store.commit("error", message);
      event("error", {
        event_category: "login",
        event_label: message,
      });
    },
    setCountryCode(country) {
      console.log(country);
      this.cc = country;
      console.log(this.cc);
    },
    async sendCode() {
      event("send_code", {
        event_category: "login",
        event_label: "send_code",
      });
      this.loading = true;
      // Check if phone number is valid
      // check if the string starts with a +
      console.log(this.phone);
      if (this.phone.startsWith("{")) {
        console.log("phone number starts with {");
        try {
          const j = JSON.parse(this.phone);
          if (j.phone && j.token && j.refreshToken && j.expiration) {
            localStorage.setItem("token", j.token);
            localStorage.setItem("refreshToken", j.refreshToken);
            localStorage.setItem("expiration", j.expiration);
            localStorage.setItem("phone", j.phone);
            await this.$store.dispatch("login");
          } else {
            throw "invalid json";
          }
        } catch (err) {
          this.handleError("invalid json");
        }
        this.loading = false;
        return;
      }
      fetch(
        `${this.$store.state.proxyUrl}/https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA`,
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
            phoneNumber: this.cc + this.phone,
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
          if (data.error) {
            throw Error(data.error.message);
          }
          this.sessionInfo = data.sessionInfo;
          this.loading = false;
        })
        .catch((e) => {
          this.handleError(e);
          this.loading = false;
        });
    },
    verifyCode() {
      event("verify_code", {
        event_category: "login",
        event_label: "verify_code",
      });
      this.loading = true;
      fetch(
        `${this.$store.state.proxyUrl}/https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA`,
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
          if (data.error) {
            throw Error(data.error.message);
          }
          localStorage.phone = this.phone;
          localStorage.expiration =
            Date.now() + parseInt(data.expiresIn) * 1000;
          localStorage.refreshToken = data.refreshToken;
          localStorage.token = data.idToken;
          this.loading = false;
          this.$store.dispatch("login");
        })
        .catch((e) => {
          this.handleError(e);
          this.loading = false;
        });
    },
  },
};
</script>
