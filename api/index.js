const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());

const port = 9000;
const fetch = require("node-fetch");

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

const serviceAccount = require("./berealviewer-f9ec3d977188.json");
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

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

async function validateToken(token) {
  const validToken = await fetch(
    "https://mobile.bereal.com/api/feeds/friends",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "user-agent": "BeReal/7242 CFNetwork/1333.0.4 Darwin/21.5.0",
        "accept-language": "en-US,en;q=0.9",
        authorization: token,
      },
    }
  ).then((r) => {
    console.log(r.status);
    console.log("200 ? ", r.status === 200);
    if (r.status === 200 || r.status === 304) {
      return "success";
    }
    return null;
  });
  return validToken;
}

app.get("/test", (req, res) => {
  console.log("test");
  res.send("Hello World!");
});
app.post("/savelogin", async (req, res) => {
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

app.post("/getlogin", async (req, res) => {
  //   const validToken = await validateToken(req.body.token);
  const ref = db.collection("users").where("syncCode", "==", code);
  const doc = await ref.get();
  if (doc.empty) {
    console.log("doc is empty");
    res.status(401).json({ error: "Invalid code" });
  } else {
    console.log("doc is not empty");
    const data = doc.docs[0].data();
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
});

app.post("/loginwithcode", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
