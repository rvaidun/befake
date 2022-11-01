// create a new express app
const express = require("express");
const app = express();
// import ffmpeg
const ffmpeg = require("fluent-ffmpeg");

// serve static files from the Vue app
app.use(express.static(__dirname + "/dist"));

// create backend api endpoint for media encoding
app.get("/api/encode", (req, res) => {
  // req.body will contain a JSON with a list of URL images to encode

  const images = req.body.images;
  const videoName = "video.mp4";
  const videoPath = __dirname + "/dist/" + videoName;
  // create a new video with the images
  console.log("who are you?");
  const video = ffmpeg();
});
// send / to index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
}); // listen on port 3000

app.listen(3000);
