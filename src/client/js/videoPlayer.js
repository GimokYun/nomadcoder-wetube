const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const videoControls = document.getElementById("videoControls");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");

let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtnClick = () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteBtnClick = () => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const { target: {value} } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) => {
    if (seconds >= 3600) {
        return new Date(1000 * seconds).toISOString().substring(11, 19);
    } else {
        return new Date(1000 * seconds).toISOString().substring(14, 19);
    }
};

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
    if (video.duration === video.currentTime) {
        playIcon.classList = "fas fa-play";
    }
};

const handleTimelineChange = (event) => {
    const { target: { value } } = event;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand"
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => videoControls.classList.remove("showing");

const handleMousemove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleMouseleave = () => {
    hideControls();
};

const handleKeydown = (event) => {
    if (event.target.id !== "textarea") {
        if (event.code === "Space") {
            handlePlayBtnClick();
        } else if (event.code === "KeyM") {
            handleMuteBtnClick();
        } else if (event.code === "KeyF") {
            videoContainer.requestFullscreen();
            fullScreenIcon.classList = "fas fa-compress";
        } else if (event.code === "Escape") {
            document.exitFullscreen();
            fullScreenIcon.classList = "fas fa-expand"
        }
    }
};

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "POST",
    });
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("canplay", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayBtnClick);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMousemove);
videoContainer.addEventListener("mouseleave", handleMouseleave);
document.body.addEventListener("keydown", handleKeydown);
