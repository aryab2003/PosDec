let capture;
let poseNet;
let singlePose = null;
let skeleton = [];

function setup() {
    createCanvas(500, 500);
    capture = createCapture(VIDEO);
    capture.size(500, 500);
    capture.hide(); 

    poseNet = ml5.poseNet(capture, modelLoaded);
    poseNet.on("pose", receivedPoses);
}

function modelLoaded() {
    console.log("PoseNet model has been loaded!");
}

function receivedPoses(results) {
    if (results.length > 0) {
        singlePose = results[0].pose;
        skeleton = results[0].skeleton;
    }
}

function detectAction() {
    if (!singlePose) return "No Action Detected";

    let leftEye = singlePose.keypoints[1];
    let rightEye = singlePose.keypoints[2];
    let nose = singlePose.keypoints[0];
    let leftEar = singlePose.keypoints[3];
    let rightEar = singlePose.keypoints[4];

    let leftWrist = singlePose.keypoints[9];
    let rightWrist = singlePose.keypoints[10];
    let leftShoulder = singlePose.keypoints[5];
    let rightShoulder = singlePose.keypoints[6];
    let leftHip = singlePose.keypoints[11];
    let rightHip = singlePose.keypoints[12];

   
    if (leftWrist.position.y < leftShoulder.position.y && rightWrist.position.y < rightShoulder.position.y) {
        return "Hands Raised";
    }

    if (leftEar.position.y < rightEar.position.y - 10) {
        return "Head Tilt Right";
    }
    if (rightEar.position.y < leftEar.position.y - 10) {
        return "Head Tilt Left";
    }

   
    if (nose.position.x < leftEye.position.x) {
        return "Looking Right";
    }
    if (nose.position.x > rightEye.position.x) {
        return "Looking Left";
    }


    return "No Action Detected";
}

function draw() {
    background(255);
    image(capture, 0, 0, width, height);

    if (singlePose) {
        fill(255, 0, 0);
        noStroke();

        for (let i = 0; i < singlePose.keypoints.length; i++) {
            let keypoint = singlePose.keypoints[i];
            if (keypoint.score > 0.2) {
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }

        stroke(255, 0, 0);
        strokeWeight(5);
        for (let j = 0; j < skeleton.length; j++) {
            line(
                skeleton[j][0].position.x, skeleton[j][0].position.y,
                skeleton[j][1].position.x, skeleton[j][1].position.y
            );
        }

        // Display detected action
        let action = detectAction();
        fill(0);
        textSize(20);
        text(action, 20, 40);
    }
}
