"use strict";

var _ffmpeg = require("@ffmpeg/ffmpeg");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

corePath: "https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js";

var recordingBtn = document.getElementById("recordingBtn");
var previewVideo = document.getElementById("preview");
var stream;
var recorder;
var videoFile;
var files = {
  input: "recording.webm",
  output: "output.mp4",
  thumbnail: "thumbnail.jpg"
};

var downloadFile = function downloadFile(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

var handleDownload = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var ffmpeg, mp4File, thumbnailFile, mp4Blob, thumbnailBlob, mp4Url, thumbnailUrl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            recordingBtn.removeEventListener("click", handleDownload);
            recordingBtn.innerText = "Transcoding...";
            recordingBtn.disabled = true;
            ffmpeg = (0, _ffmpeg.createFFmpeg)({
              log: true
            });
            _context.next = 6;
            return ffmpeg.load();

          case 6:
            _context.t0 = ffmpeg;
            _context.t1 = files.input;
            _context.next = 10;
            return (0, _ffmpeg.fetchFile)(videoFile);

          case 10:
            _context.t2 = _context.sent;

            _context.t0.FS.call(_context.t0, "writeFile", _context.t1, _context.t2);

            _context.next = 14;
            return ffmpeg.run("-i", files.input, "-r", "60", files.output);

          case 14:
            _context.next = 16;
            return ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumbnail);

          case 16:
            mp4File = ffmpeg.FS("readFile", files.output);
            thumbnailFile = ffmpeg.FS("readFile", files.thumbnail);
            mp4Blob = new Blob([mp4File.buffer], {
              type: "video/mp4"
            });
            thumbnailBlob = new Blob([thumbnailFile.buffer], {
              type: "image/jpg"
            });
            mp4Url = URL.createObjectURL(mp4Blob);
            thumbnailUrl = URL.createObjectURL(thumbnailBlob);
            downloadFile(mp4Url, "MyRecording.mp4");
            downloadFile(thumbnailUrl, "MyThumbnail.jpg");
            ffmpeg.FS("unlink", files.input);
            ffmpeg.FS("unlink", files.output);
            ffmpeg.FS("unlink", files.thumbnail);
            URL.revokeObjectURL(videoFile);
            URL.revokeObjectURL(mp4Url);
            URL.revokeObjectURL(thumbnailUrl);
            recordingBtn.disabled = false;
            recordingBtn.innerText = "Record Again";
            recordingBtn.addEventListener("click", handleStartRecording);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleDownload() {
    return _ref.apply(this, arguments);
  };
}();

var handleStopRecording = function handleStopRecording() {
  recordingBtn.innerText = "Download Recording";
  recordingBtn.removeEventListener("click", handleStopRecording);
  recordingBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

var handleStartRecording = function handleStartRecording() {
  var recordingIcon = document.createElement("i");
  recordingIcon.className = "fa-solid fa-circle";
  recordingBtn.innerText = "Stop Recording";
  recordingBtn.prepend(recordingIcon);
  recordingBtn.removeEventListener("click", handleStartRecording);
  recordingBtn.addEventListener("click", handleStopRecording);
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = function (event) {
    videoFile = URL.createObjectURL(event.data);
    previewVideo.srcObject = null;
    previewVideo.src = videoFile;
    previewVideo.loop = true;
    previewVideo.play();
  };

  recorder.start();
};

var init = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true
            });

          case 2:
            stream = _context2.sent;
            previewVideo.srcObject = stream;
            previewVideo.play();

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function init() {
    return _ref2.apply(this, arguments);
  };
}();

init();
recordingBtn.addEventListener("click", handleStartRecording);