import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }
});

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: "wimm-ygm/images",
    acl: "public-read"
});

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: "wimm-ygm/videos",
    acl: "public-read"
});

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const loggedInOnlyMiddleware = (req, res, next) => {
    if (res.locals.loggedIn) {
        next();
    } else {
        req.flash("error", "Log in first");
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!res.locals.loggedIn) {
        next();
    } else {
        req.flash("error", "Not permitted");
        return res.redirect("/");
    }
};

export const uploadAvatars = multer({
    dest: "uploads/avatars/", 
    limits: {
        fileSize: 5000000
    },
    storage: s3ImageUploader,
});

export const uploadVideos = multer({
    dest: "uploads/videos/", 
    limits: {
        fileSize: 10000000
    },
    storage: s3VideoUploader,
});