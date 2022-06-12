import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
    const videos = await Video.find({}).populate("owner");
    return res.render("home", {pageTitle:"Home", videos});
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    let comments = video.comments;
    for (let i = 0 ; i < video.comments.length ; i++) {
        const comment = comments[i];
        const commentOwner = await User.findById(comment.owner);
        comments[i].owner = commentOwner;
    }
    return res.render("watch", {pageTitle: video.title, video, comments});
};

export const getEdit = async (req, res) => {
    const {
        params: { id },
        session: {
            user: { _id }
        }
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if (String(video.owner) !== _id) {
        req.flash("error", "Not permitted");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle:`Editing`, video});
};

export const postEdit = async (req, res) => {
    const {
        params: { id },
        body: { title, description, hashtags },
        session: {
            user: { _id }
        }
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if (String(video.owner) !== _id) {
        req.flash("error", "Not permitted");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "Video updated");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle:"Upload Video"});
};

export const postUpload = async (req, res) => {
    const {
        body: {
            title, description, hashtags
        },
        files: {
            video, thumbnail
        }, 
        session: {
            user: {
                _id
            }
        }
    } = req;
    try {
        const newVideo = await Video.create({
            title,
            fileUrl: video[0].location,
            thumbnailUrl: thumbnail[0].location,
            description,
            hashtags: Video.formatHashtags(hashtags),
            meta: {
                views: 0,
                ratings: 0,
            },
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        req.flash("success", "Video uploaded");
        return res.redirect("/");
    } catch(error) {
        return res.status(400).render("upload", {pageTitle:"Upload Video", errorMessage: error._message,});
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id },
        session: {
            user: { _id }
        }
    } = req;
    const video = await Video.findById(id);
    const user = await User.findById(_id);
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if (String(video.owner) !== _id) {
        req.flash("error", "Not permitted");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    user.videos.splice(user.videos.indexOf(id), 1);
    user.save();
    req.flash("success", "Video deleted");
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            },
        }).populate("owner");
    }
    return res.render("search", {pageTitle: "Search", videos});
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const {
        params: { id },
        body: { text },
        session: { user },
    } = req;

    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }

    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });

    video.comments.push(comment);
    video.save();

    return res.status(201).json({newCommentId: comment._id, avatar: user.avatarUrl, name: user.name});
};

export const deleteComment = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;

    const comment = await Comment.findById(id).populate("owner");
    if (!comment || String(user._id) !== String(comment.owner._id)) {
        return res.sendStatus(404);
    }

    const video = await Video.findById(comment.video);
    if (!video) {
        return res.sendStatus(404);
    }
    video.comments.splice(video.comments.indexOf(id), 1);
    await video.save();

    await Comment.findByIdAndDelete(id);

    return res.sendStatus(200);
};