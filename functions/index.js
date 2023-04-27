const functions = require("firebase-functions");
const fetch = require("node-fetch");
exports.login = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const body = JSON.parse(req.body);
  fetch(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
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
      console.log("this is the phone number:", body.phoneNumber);

      fetch(
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
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
            phoneNumber: body.phoneNumber,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            if (data.error.message === "APP_NOT_VERIFIED") {
              fetch("https://auth.bereal.team/api/vonage/request-code", {
                method: "POST",
                headers: {
                  accept: "application/json",
                  "content-type": "application/json",
                  "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
                  "accept-language": "en-US,en;q=0.9",
                },
                body: JSON.stringify({
                  phoneNumber: body.phoneNumber,
                  deviceId: "ntbgbuk8ly5gjvv3",
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    console.log("vonage error");
                  }
                  return response.json();
                })
                .then((data2) => {
                  console.log("vonage data", data2);
                  res.send({
                    sessionInfo: data2.vonageRequestId,
                    vonage: true,
                  });
                });
            } else {
              console.log("came in error");
              functions.logger.error(
                data.error.message,
                data.error,
                body.phoneNumber
              );
            }
          } else {
            res.send(data);
            functions.logger.log(data);
            functions.logger.log("Verification code sent to", body.phoneNumber);
          }
        })
        .catch((error) => {
          res.send(error);
          functions.logger.error(error);
        });
    });
  // NEW
});
