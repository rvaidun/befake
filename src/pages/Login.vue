<template>
  <div v-if="!sessionInfo">
    <div class="text-center text-white pt-10">
      <h1 class="font-bold mt-0 mb-6 text-7xl">BeFake</h1>
      <h3 class="text-2xl font-bold mb-8">A BeReal Viewer</h3>
    </div>
    <div class="flex items-center justify-center mt-[75%] flex-col sm:flex-row sm:mt-[15%]">
      <VueCountryCode @asdfasdf="setCountryCode" />
      <MyInput @enterPressed="sendCode" typeOfInput="tel" v-model="phone" placeholder="Phone Number" class="max-w-sm" />
      <MyButton @clickedd="sendCode" :loading="loading">Send</MyButton>
    </div>
  </div>

  <div v-else>
    <div class="flex items-center justify-center mt-[75%] flex-col sm:flex-row sm:mt-[25%]">
      <span class="mr-2 dark:text-white">Enter the OTP sent to your phone number:
      </span>
      <MyInput @enterPressed="verifyCode" v-model="code" placeholder="123456" class="max-w-sm" typeOfInput="number" />
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
      vonage: false,
    };
  },
  methods: {
    handleError(error) {
      console.error("Login page error:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      if (error && error.response) {
        // Attempt to get more details from the response
        error.response.text().then(text => {
          console.error("Error response data:", text);
          try {
            const parsed = JSON.parse(text);
            if (parsed && (parsed.message || parsed.error?.message)) {
              errorMessage = parsed.message || parsed.error.message;
            }
          } catch (e) {
            // text was not JSON, use it as is if not too long
            if (text.length < 200) { // Avoid overly long messages
              errorMessage = text;
            }
          }
          this.$store.commit("error", errorMessage);
          event("error", {
            event_category: "login",
            event_label: errorMessage,
            error_object: JSON.stringify(error, Object.getOwnPropertyNames(error)) // Log full error object details
          });
        }).catch(e => {
          console.error("Error reading response text:", e);
          this.$store.commit("error", errorMessage);
          event("error", {
            event_category: "login",
            event_label: errorMessage,
            error_object: JSON.stringify(error, Object.getOwnPropertyNames(error))
          });
        });
      } else {
        this.$store.commit("error", errorMessage);
        event("error", {
          event_category: "login",
          event_label: errorMessage,
          error_object: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
      }
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
          if (
            j.token &&
            j.refreshToken &&
            j.expiration &&
            j.user_id &&
            j.fbrefreshtoken &&
            j.fbtoken
          ) {
            localStorage.setItem("token", j.token);
            localStorage.setItem("refreshToken", j.refreshToken);
            localStorage.setItem("expiration", j.expiration);
            localStorage.setItem("user_id", j.user_id);
            localStorage.setItem("fbrefreshtoken", j.fbrefreshtoken);
            localStorage.setItem("fbtoken", j.fbtoken);
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
        `${this.$store.state.proxyUrl}/https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "*/*",
            "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
            "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
            "accept-language": "en",
            "user-agent":
              "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1",
            "x-firebase-locale": "en",
            "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
          },
          body: JSON.stringify({
            appToken:
              "54F80A258C35A916B38A3AD83CA5DDD48A44BFE2461F90831E0F97EBA4BB2EC7",
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("this is the data receipt:", data.receipt);
          fetch(
            `${this.$store.state.proxyUrl}/https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                accept: "*/*",
                "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
                "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
                "accept-language": "en",
                "user-agent":
                  "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.28.2 iPhone/14.7.1 hw/iPhone9_1",
                "x-firebase-locale": "en",
                "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
              },
              body: JSON.stringify({
                iosReceipt: data.receipt,
                phoneNumber: this.cc + this.phone,
              }),
            }
          )
            .then(async (response) => {
              if (!response.ok) {
                let errorData = await response.text();
                try {errorData = JSON.parse(errorData);} catch (e) {}
                console.error('API Error Response (sendVerificationCode):', errorData);
                throw new Error(typeof errorData === 'string' ? errorData : (errorData.error?.message || errorData.message || response.statusText));
              }
              return response.json();
            })
            .then((data) => {
              // The original code checked data.error here.
              // If the new error handling for !response.ok is correct,
              // data.error might not be present anymore if the server signaled error with HTTP status.
              // However, some APIs might return 200 OK with an error in the body.
              if (data.error && data.error.message === "APP_NOT_VERIFIED") {
                  // handle app not verified
                  return fetch( // Ensure to return the promise chain here
                    `${this.$store.state.proxyUrl}/https://auth.bereal.team/api/vonage/request-code`,
                    {
                      method: "POST",
                      headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        "user-agent":
                          "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
                        "accept-language": "en-US,en;q=0.9",
                      },
                      body: JSON.stringify({
                        phoneNumber: this.cc + this.phone,
                        deviceId: "ntbgbuk8ly5gjvv3",
                      }),
                    }
                  )
                    .then(async (response) => { // vonage request-code
                      if (!response.ok) {
                        let errorData = await response.text();
                        try {errorData = JSON.parse(errorData);} catch (e) {}
                        console.error('API Error Response (vonage/request-code):', errorData);
                        throw new Error(typeof errorData === 'string' ? errorData : (errorData.message || response.statusText));
                      }
                      return response.json();
                    })
                    .then((data2) => {
                      console.log("vonage data", data2);
                      if (data2.error) { // Check for error in vonage response body
                        throw new Error(data2.error.message || "Vonage request code failed");
                      }
                      return {
                        sessionInfo: data2.vonageRequestId,
                        vonage: true,
                      };
                    });
                } else if (data.error) { // Handle other errors from sendVerificationCode if response was ok
                  console.error(
                    "sendVerificationCode responded with an error in body:",
                    data.error
                  );
                  throw new Error(data.error.message || "Failed to send verification code");
                }
                return data; // this is the sessionInfo if no error or APP_NOT_VERIFIED handled
              }
            })
            .then((data) => {
              // data could be undefined if an error was thrown and caught by the main catch
              if (data && data.sessionInfo) {
                this.sessionInfo = data.sessionInfo;
              }
              if (data && data.vonage) {
                this.vonage = true;
              }
              this.loading = false;
            })
            .catch((error) => { // This is the main catch for the sendCode promise chain
              this.handleError(error); // Pass the full error object
              this.loading = false;
            });
        });
    },
    verifyCode() {
      event("verify_code", {
        event_category: "login",
        event_label: "verify_code",
      });

      this.loading = true;
      if (this.vonage) {
        fetch(
          `${this.$store.state.proxyUrl}/https://auth.bereal.team/api/vonage/check-code`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
              "accept-language": "en-US,en;q=0.9",
            },
            body: JSON.stringify({
              code: this.code,
              vonageRequestId: this.sessionInfo,
            }),
          }
        )
          .then(async (res) => {
            if (!res.ok) {
              let errorData = await res.text();
              try {errorData = JSON.parse(errorData);} catch(e) {}
              console.error('API Error Response (vonage/check-code):', errorData);
              throw new Error(typeof errorData === 'string' ? errorData : (errorData.message || res.statusText));
            }
            return res.json();
          })
          .then((vdata) => {
            if (vdata.error) { // Check for error in vonage check-code response body
              throw new Error(vdata.error.message || "Vonage check code failed");
            }
            return fetch(
              `${this.$store.state.proxyUrl}/https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q`,
              {
                method: "POST",
                body: JSON.stringify({
                  token: vdata.token,
                  returnSecureToken: true,
                }),
              }
            );
          })
          .then(async (res) => { // verifyCustomToken
            if (!res.ok) {
              let errorData = await res.text();
              try {errorData = JSON.parse(errorData);} catch(e) {}
              console.error('API Error Response (verifyCustomToken):', errorData);
              throw new Error(typeof errorData === 'string' ? errorData : (errorData.error?.message || errorData.message || res.statusText));
            }
            return res.json();
          })
          .then((idtokendata) => {
            if (idtokendata.error) { // Check for error in verifyCustomToken response body
              throw new Error(idtokendata.error.message || "Failed to verify custom token");
            }
            // this needs to be set since the store is using it
            localStorage.setItem("fbrefreshtoken", idtokendata.refreshToken);
            return this.$store.dispatch("refresh");
          })
          .then(() => {
            this.loading = false;
            // Ensure login is dispatched only on success
            return this.$store.dispatch("login");
          })
          .catch((e) => { // Main catch for the vonage verify code path
            this.handleError(e); // Pass the full error object
            this.loading = false;
          });
        return;
      }
      fetch(
        `${this.$store.state.proxyUrl}/https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q`,
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
        .then(async (res) => { // verifyPhoneNumber
            if (!res.ok) {
              let errorData = await res.text();
              try {errorData = JSON.parse(errorData);} catch(e) {}
              console.error('API Error Response (verifyPhoneNumber):', errorData);
              throw new Error(typeof errorData === 'string' ? errorData : (errorData.error?.message || errorData.message || res.statusText));
            }
            return res.json();
        })
        .then((idtokendata) => {
          if (idtokendata.error) { // Check for error in verifyPhoneNumber response body
            throw new Error(idtokendata.error.message || "Failed to verify phone number");
          }
          // this needs to be set since the store is using it
          localStorage.setItem("fbrefreshtoken", idtokendata.refreshToken);
          return this.$store.dispatch("refresh");
        })
        .then(() => {
          this.loading = false;
          // Ensure login is dispatched only on success
          this.$store.dispatch("login");
        })
        .catch((e) => { // Main catch for the standard verify code path
          this.handleError(e); // Pass the full error object
          this.loading = false;
        });
    },
  },
};
</script>
