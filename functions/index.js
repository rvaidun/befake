const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function validateToken(token) {
  return fetch("https://mobile.bereal.com/api/feeds/friends", {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
      "accept-language": "en-US,en;q=0.9",
      authorization: token,
    },
  }).then((r) => {
    console.log(r.status);
    if (r.status === 200 || r.status === 304) {
      return "success";
    }
    return null;
  });
}
exports.savelogin = functions.https.onRequest(async (req, res) => {
  // get the body
  const body = req.body;
  console.log(body.token);
  // make sure authorization is valid by pinging the bereal API
  const validToken = await validateToken(body.token);
  console.log("valid token is ", validToken);
  if (validToken) {
    const test = parseJwt(body.token);
    // add the document to the database
    // create a new document with id equal to the phone number
    const docRef = db.collection("users").doc(test.phone_number);
    // set the document data
    body.syncCode = makeid(40);
    await docRef.set(body);
    // return the document
    res.json({
      result: `Message with ID: ${docRef.id} added.`,
      syncCode: body.syncCode,
      success: true,
    });
  } else {
    res.status(401).send("Invalid authorization token");
  }
});

exports.getlogin = functions.https.onRequest("/getlogin", async (req, res) => {
  //   const validToken = await validateToken(req.body.token);
  const ref = db.collection("users").where("syncCode", "==", req.body.code);
  const doc = await ref.get();
  if (doc.empty) {
    console.log("doc is empty");
    res.status(401).json({ error: "Invalid code" });
  } else {
    console.log("doc is not empty");
    const data = doc.docs[0].data();
    if (Date.now() < data.expiration) {
      res.status(200).json({
        data,
        success: true,
      });
    } else {
      fetch(
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA",
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
          // update the token in the database
          const docRef = db.collection("users").doc(test.phone_number);
          // set the document data
          js = {
            token: data.access_token,
            expiration: Date.now() + data.expires_in * 1000,
            refreshToken: data.refresh_token,
          };
          docRef.update(js);
          // return the document
          res.status(200).json({
            success: true,
            token: data.access_token,
            expiration: Date.now() + data.expires_in * 1000,
            refreshToken: data.refresh_token,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(401).json({ error: "Invalid code" });
        });
    }
  }
});

exports.loginwithcode = functions.https.onRequest(async (req, res) => {
  const code = req.body.code;
  const ref = db.collection("users").where("syncCode", "==", code);
  const doc = await ref.get();
  if (doc.empty) {
    console.log("doc is empty");
    res.status(401).json({ error: "Invalid code" });
  } else {
    console.log("doc is not empty");
    const data = doc.docs[0].data();
    data.success = true;
    res.status(200).json(data);
  }
});

exports.delete = functions.https.onRequest(async (req, res) => {
  const auth = req.body.token;
  const validToken = await validateToken(auth);
  if (validToken) {
    const test = parseJwt(auth);
    const docRef = db.collection("users").doc(test.phone_number);
    await docRef.delete();
    res.json({
      result: `Message with ID: ${docRef.id} deleted.`,
      success: true,
    });
  } else {
    res.status(401).send("Invalid authorization token");
  }
});
