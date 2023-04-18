const functions = require("firebase-functions");
const fetch = require("node-fetch");
exports.login = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const body = JSON.parse(req.body);
  if (
    body.phoneNumber.includes("+44") ||
    body.phoneNumber.includes("+41") ||
    body.phoneNumber.includes("+33")
  ) {
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
          iosReceipt:
            "AEFDNu8dYeHiMHJkSk-bRVzcPSuvhqoJz0FQeybNQMaCdU9Xtb8LaVTQcD2ukcrYMlclppmQKt64mPKfkSLY67zTZPKf0akAt_2vdJsx9lT_4w83LsL8v5We0ypSONzeMhn2",
          iosSecret: "e1akdEm0ZkjLMM-a",
          phoneNumber: body.phoneNumber,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        res.send(data);
        if (data.error) {
          functions.logger.error(data.error.message, data.error);
        } else {
          functions.logger.log(data);
          functions.logger.log("Verification code sent to", body.phoneNumber);
        }
      })
      .catch((error) => {
        res.send(error);
        functions.logger.error(error);
      });
    return;
  }
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
          res.send(data);
          if (data.error) {
            console.log("came in error");
            functions.logger.error(
              data.error.message,
              data.error,
              body.phoneNumber
            );
          } else {
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
