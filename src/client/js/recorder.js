corePath: "https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordingBtn = document.getElementById("recordingBtn");
const previewVideo = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumbnail: "thumbnail.jpg"
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async () => {
    recordingBtn.removeEventListener("click", handleDownload);
    recordingBtn.innerText = "Transcoding...";
    recordingBtn.setAttribute("disabled", true);

    const ffmpeg = createFFmpeg({log: true});
    await ffmpeg.load();

    // create file in the virtual world of FFmpeg
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    // transcoding from .webm to .mp4 file
    // get an input, files.input, and convert it to files.output with 60 frames per second("-r", "60")
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    // go to 00:00:01 of files.input("-ss", "00:00:01"), caputre a screenshot of the first frame("-frames:v", "1"), and save it to files.thumbnail
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumbnail);

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbnailFile = ffmpeg.FS("readFile", files.thumbnail);

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});
    const thumbnailBlob = new Blob([thumbnailFile.buffer], {type: "image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbnailUrl, "MyThumbnail.jpg");

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumbnail);

    URL.revokeObjectURL(videoFile);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbnailUrl);

    recordingBtn.removeAttribute("disabled");
    recordingBtn.innerText = "Record Again";
    recordingBtn.addEventListener("click", handleStartRecording);
};

const handleStartRecording = () => {
    const recordingIcon = document.createElement("i");
    recordingIcon.className = "fa-solid fa-circle";
    recordingBtn.innerText = "Recording";
    recordingBtn.prepend(recordingIcon);
    recordingBtn.removeEventListener("click", handleStartRecording);
    recordingBtn.setAttribute("disabled", true);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        previewVideo.srcObject = null;
        previewVideo.src = videoFile;
        previewVideo.loop = true;
        previewVideo.play();
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
        recordingBtn.innerText = "Download Recording";
        recordingBtn.removeAttribute("disabled");
        recordingBtn.addEventListener("click", handleDownload);
    }, 5000);
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    previewVideo.srcObject = stream;
    previewVideo.play();
};

init();

recordingBtn.addEventListener("click", handleStartRecording);
