// Variables for show video from webcam and video from handTrack.js API
const video = document.getElementById('video');
const canvas = document.getElementById('Mycanvas');
const context = canvas.getContext('2d');

let toggleButton = document.getElementById('toggleButton');
toggleButton.disabled = true;

let updatenote = document.getElementById('updatenote');


// Model parameters for pre-trained models from handTrack.js API
const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
}

// Variables for activate video and model
let isVideo = false;
let model = null;

toggleButton.addEventListener("click", function (){
   toggleVideo();
});


// Function for detect and starting video
function toggleVideo(){
    if (!isVideo){
        updatenote.innerText = 'Starting video...';
        startVideo();
    } else {
        updatenote.innerText = 'Stopping Video...';
        handTrack.stopVideo(video);
        isVideo = false;
        updatenote.innerText = 'Video is stopped!';
    }
}

// Function for start video from handtrack detection
function startVideo(){
    handTrack.startVideo(video).then(function (status){
        if (status){
            updatenote.innerText = 'Video is started, now tracking your hands';
            isVideo = true;
            rundetection();
        } else {
            updatenote.innerText = 'Enable video';
        }
    })
}

// Function for detection hands and extract predictions for have interaction with menu and sub menu with movement of
// hands from right to left in web page
function rundetection(){
    model.detect(video).then(predictions => {
        model.renderPredictions(predictions, canvas, context, video);
        document.getElementById('salud').innerHTML = "SALUD";
        document.getElementById('tramites').innerHTML = "TRÁMITES";
        document.getElementById('informacion').innerHTML = "INFORMACIÓN";

        try {
            if (predictions[0].bbox[0]){
                let x = predictions[0].bbox[0];
                if (x < 80){
                    document.getElementById('salud').innerHTML = "<ul>\n" +
                        "<li>OMS</li>\n" +
                        "<li>RECOMENDACIONES</li>\n" +
                        "<li>CORONAVIRUS</li>\n" +
                        "</ul>";
                } else if (x > 80 && x < 200){
                    document.getElementById('tramites').innerHTML = "<ul>\n" +
                        "<li>Afiliación</li>\n" +
                        "<li>Seguro voluntario</li>" +
                        "</ul>";

                } else if (x > 200 && x < 350){
                    document.getElementById('informacion').innerHTML = "<ul>\n" +
                        "<li>Extranjeros</li>\n" +
                        "<li>Nacionales</li>" +
                        "</ul>";
                }
            }
        } catch (error){
            console.error(error);
        }

        if (isVideo){
            requestAnimationFrame(rundetection);
        }
    })
}

// Call model from API
handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
    updatenote.innerText = 'Deep learning model is loaded!';
    toggleButton.disabled = false;
})