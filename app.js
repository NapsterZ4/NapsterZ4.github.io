const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let toggleButton = document.getElementById('toggleButton');
toggleButton.disabled = true;

let updatenote = document.getElementById('updatenote');

const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
}

let isVideo = false;
let model = null;

toggleButton.addEventListener("click", function (){
   toggleVideo();
});

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

function rundetection(){
    model.detect(video).then(predictions => {
        model.renderPredictions(predictions, canvas, context, video);
        document.getElementById('salud').classList.remove('BigLetter');
        document.getElementById('tramites').classList.remove('BigLetter');
        document.getElementById('informacion').classList.remove('BigLetter');

        try {
            if (predictions[0].bbox[0]){
                let x = predictions[0].bbox[0];

                if (x < 80){
                    document.getElementById('salud').classList.add('BigLetter');
                } else if (x > 80 && x < 200){
                    document.getElementById('tramites').classList.add('BigLetter');
                } else if (x > 200 && x < 350){
                    document.getElementById('informacion').classList.add('BigLetter');
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

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
    updatenote.innerText = 'Deep learning model is loaded!';
    toggleButton.disabled = false;
})