// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js');
    });
  }

  // Firebase
    const video = document.getElementById('video');
    const recordButton = document.getElementById('recordButton');
    const switchCameraButton = document.getElementById('switchCameraButton');
    let recording = false;
    let mediaRecorder;
    let stream;
    let useFrontCamera = true;

    function getCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: useFrontCamera ? 'user' : 'environment' } 
        })
        .then(function(s) {
            stream = s;
            video.srcObject = s;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });
    }

    getCamera();

    switchCameraButton.addEventListener('click', function() {
        useFrontCamera = !useFrontCamera;
        getCamera();
    });

    recordButton.addEventListener('click', function() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordButton.textContent = 'Record';
    } else {
        chunks = [];
        mediaRecorder = new MediaRecorder(video.srcObject);
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
            // Call sendFrameToAPI function every 5 seconds
            setTimeout(function() {
                sendFrameToAPI(e.data);
            }, 2000);
        };
        mediaRecorder.onstop = function() {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = videoUrl;
            downloadLink.download = 'recorded_video.webm';
            downloadLink.click();
        };
        mediaRecorder.start();
        recordButton.textContent = 'Stop';
    }
    });

    function sendFrameToAPI(frame) {
        // Code to send frame to API
    }
    
    function saveFrame() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = frameUrl;
        downloadLink.download = 'frame.png';
        downloadLink.click();
    }
    
    setInterval(saveFrame, 10000); // Save frame every 2 seconds



    /* PWA INSTALL PROMPT */ 
    