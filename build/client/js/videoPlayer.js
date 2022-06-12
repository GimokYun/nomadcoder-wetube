"use strict";

var videoContainer = document.getElementById("videoContainer");
var video = document.querySelector("video");
var videoControls = document.getElementById("videoControls");
var playBtn = document.getElementById("play");
var playIcon = playBtn.querySelector("i");
var muteBtn = document.getElementById("mute");
var muteIcon = muteBtn.querySelector("i");
var volumeRange = document.getElementById("volume");
var currentTime = document.getElementById("currentTime");
var totalTime = document.getElementById("totalTime");
var timeline = document.getElementById("timeline");
var fullScreenBtn = document.getElementById("fullScreen");
var fullScreenIcon = fullScreenBtn.querySelector("i");
var controlsTimeout = null;
var volumeValue = 0.5;
video.volume = volumeValue;

var handlePlayBtnClick = function handlePlayBtnClick() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

  playIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

var handleMuteBtnClick = function handleMuteBtnClick() {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }

  muteIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

var handleVolumeChange = function handleVolumeChange(event) {
  var value = event.target.value;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }

  volumeValue = value;
  video.volume = value;
};

var formatTime = function formatTime(seconds) {
  if (seconds >= 3600) {
    return new Date(1000 * seconds).toISOString().substring(11, 19);
  } else {
    return new Date(1000 * seconds).toISOString().substring(14, 19);
  }
};

var handleLoadedMetaData = function handleLoadedMetaData() {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

var handleTimeUpdate = function handleTimeUpdate() {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);

  if (video.duration === video.currentTime) {
    playIcon.classList = "fas fa-play";
  }
};

var handleTimelineChange = function handleTimelineChange(event) {
  var value = event.target.value;
  video.currentTime = value;
};

var handleFullScreen = function handleFullScreen() {
  var fullScreen = document.fullscreenElement;

  if (fullScreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

var hideControls = function hideControls() {
  return videoControls.classList.remove("showing");
};

var handleMousemove = function handleMousemove() {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(hideControls, 3000);
};

var handleMouseleave = function handleMouseleave() {
  hideControls();
};

var handleKeydown = function handleKeydown(event) {
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
      fullScreenIcon.classList = "fas fa-expand";
    }
  }
};

var handleEnded = function handleEnded() {
  var id = videoContainer.dataset.id;
  fetch("/api/videos/".concat(id, "/view"), {
    method: "POST"
  });
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayBtnClick);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMousemove);
videoContainer.addEventListener("mouseleave", handleMouseleave);
document.body.addEventListener("keydown", handleKeydown);