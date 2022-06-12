import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, maxlength: 80},
    fileUrl: {type: String, required: true},
    thumbnailUrl: {type: String, required: true},
    description: {type: String, required: true, trim: true},
    createAt: {type: Date, required: true, default: Date.now},
    hashtags: [{type: String, trim: true}],
    meta: {
        views: {type: Number, required: true, default: 0},
    },
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map((word) => word.startsWith("#") ? word.trim() : `#${word.trim()}`);
});

const Video = new mongoose.model("Video", videoSchema);

export default Video;