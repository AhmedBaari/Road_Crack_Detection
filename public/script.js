// Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

// Firebase
const video = document.getElementById("video");
const recordButton = document.getElementById("recordButton");
const switchCameraButton = document.getElementById("switchCameraButton");
let recording = false;
let mediaRecorder;
let stream;
let useFrontCamera = true;

function getCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: useFrontCamera ? "user" : "environment" },
    })
    .then(function (s) {
      stream = s;
      video.srcObject = s;
      video.play();
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });
}

getCamera();

switchCameraButton.addEventListener("click", function () {
  useFrontCamera = !useFrontCamera;
  getCamera();
});

/* Websocket connection to localhost:8765 to send the frame every 2 seconds 
const ws = new WebSocket("ws://localhost:8765");
ws.onopen = function () {
  console.log("Connected to localhost:8765");
};
ws.onclose = function () {
  console.log("Disconnected from localhost:8765");
};
ws.onerror = function (error) {
  console.log("Error: " + error);
};

ws.onmessage = function (e) {
    console.log(e.data);
}
*/


function saveFrame() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frameUrl = canvas.toDataURL("image/png");
  const downloadLink = document.createElement("a");
  downloadLink.href = frameUrl;
  downloadLink.download = "frame.png";
  downloadLink.click();
}

function saveVideo() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frameUrl = canvas.toDataURL("image/png");
  const downloadLink = document.createElement("a");
  downloadLink.href = frameUrl;
  downloadLink.download = "recorded_video.webm";
  downloadLink.click();
}

let recordingInterval;

recordButton.addEventListener("click", function () {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    clearInterval(recordingInterval);
    recordButton.textContent = "Record";
  } else {
    chunks = [];
    mediaRecorder = new MediaRecorder(video.srcObject);
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
      // Call sendFrameToAPI function every 5 seconds
      setTimeout(function () {
        sendFrameToAPI(e.data);
      }, 2000);
    };
    mediaRecorder.onstop = function () {
      const blob = new Blob(chunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = videoUrl;
      downloadLink.download = "recorded_video.webm";
      downloadLink.click();
    };
    mediaRecorder.start();
    //recordingInterval = setInterval(saveVideo, 10000); // Save video every 10 seconds
    recordButton.textContent = "Stop";
  }
});

function sendFrameToAPI() {
  const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
context.drawImage(video, 0, 0, canvas.width, canvas.height);
const frameUrl = canvas.toDataURL("image/webp");

// Convert data URL to Blob
const fetchResponse = fetch(frameUrl);
fetchResponse.then(res => res.blob()).then(blob => {
  const formData = new FormData();
  formData.append("image", blob, 'image.webp');

  fetch("http://localhost:6789/process_image", {
    method: "POST",
    body: formData
  })
  .then(async  response => {
    if (await response.ok) {
      data = await response.json();
      damage = data.damage;
      console.log(damage);

      // DAMAGE HANDLING 
      if (damage == 1) {
        console.log("Damage detected");
        
        // Show alert screen -- ISSAC
        const alertScreen = document.getElementById("alertScreen");
        alertScreen.style.display = "block";

        

      }


      console.log("Frame sent successfully");
    } else {
      console.log("Failed to send frame");
    }
  })
  .catch(error => {
    console.log("An error occurred: " + error);
  });
});
}

function saveFrame() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frameUrl = canvas.toDataURL("image/png");
  const downloadLink = document.createElement("a");
  downloadLink.href = frameUrl;
  downloadLink.download = "frame.png";
  downloadLink.click();
}

setInterval(saveFrame, 10000);
setInterval(sendFrameToAPI, 2000);

// Save frame every 2 seconds

/* PWA INSTALL PROMPT */



