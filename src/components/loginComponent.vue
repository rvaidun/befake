<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes bounce-in {
  0% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1.25);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
</style>
<template>
  <Transition name="bounce">
    <ErrorToast v-if="error.show" :text="error.text" />
  </Transition>

  <div v-if="!sessionInfo">
    <div
      class="flex items-center justify-center mt-[75%] flex-col sm:flex-row sm:mt-[25%]"
    >
      <span class="mr-2 dark:text-white">
        Enter your phone number with country code and +:
      </span>
      <input
        type="text"
        placeholder="+11234567890"
        v-model="phone"
        class="border-black border-2 mr-2"
      />
      <div
        @click="sendCode"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer flex"
      >
        <span>Send</span>
        <PulseLoader v-if="loading"></PulseLoader>
      </div>
    </div>
  </div>

  <div v-else>
    <div
      class="flex items-center justify-center mt-[75%] flex-col sm:flex-row sm:mt-[25%]"
    >
      <span class="mr-2 dark:text-white">Enter your code: </span>
      <input
        type="text"
        placeholder="123456"
        v-model="code"
        class="border-black border-2 mr-2"
      />
      <div
        @click="verifyCode"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded curosor-pointer flex"
      >
        <span>Verify</span>
        <PulseLoader v-if="loading"></PulseLoader>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import erroralertVue from "./errorToast.vue";
import ErrorToast from "./errorToast.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { event } from "vue-gtag";
export default {
  components: { erroralertVue, ErrorToast, PulseLoader },
  props: ["login"],
  data() {
    return {
      phone: "",
      sessionInfo: "",
      code: "",
      error: {
        text: "",
        show: false,
      },
      loading: false,
    };
  },
  methods: {
    async sendCode() {
      event("send_code", {
        event_category: "login",
        event_label: "send_code",
      });
      this.loading = true;
      if (!this.phone.startsWith("+")) {
        console.log("does not start with +");
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
          this.error = {
            show: true,
            text: "Invalid phone number",
          };
          event("invalid_phone", {
            event_category: "login",
            event_label: "invalid_phone",
          });
          setTimeout(() => (this.error = false), 5000);
        }
        this.loading = false;
        return;
      }
      console.log("Doing fetch!");
      fetch(
        "https://warm-scrubland-06418.herokuapp.com/https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
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
          if (data.error) {
            throw Error(data.error.message);
          }
          this.sessionInfo = data.sessionInfo;
          this.loading = false;
        })
        .catch((e) => {
          console.log("hi");
          this.error = {
            show: true,
            text: e,
          };
          this.loading = false;
          setTimeout(() => (this.error = false), 5000);
          event("error", {
            event_category: "login",
            event_label: "error",
          });
        });
    },
    verifyCode() {
      event("verify_code", {
        event_category: "login",
        event_label: "verify_code",
      });
      this.loading = true;
      fetch(
        "https://warm-scrubland-06418.herokuapp.com/https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
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
          this.$store.commit("login");
        })
        .catch((e) => {
          console.log("Hi");
          console.log(e);
          this.error = {
            show: true,
            text: e,
          };
          this.loading = false;
          setTimeout(() => (this.error = false), 5000);
        });
    },
  },
};
</script>
