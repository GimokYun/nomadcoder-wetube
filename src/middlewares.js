import multer from "multer";

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

export const uploadAvatars = multer({dest: "uploads/avatars/", limits: {
    fileSize: 3000000
}});

export const uploadVideos = multer({dest: "uploads/videos/", limits: {
    fileSize: 10000000
}});