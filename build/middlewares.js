"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadVideos = exports.uploadAvatars = exports.publicOnlyMiddleware = exports.loggedInOnlyMiddleware = exports.localsMiddleware = void 0;

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var localsMiddleware = function localsMiddleware(req, res, next) {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

exports.localsMiddleware = localsMiddleware;

var loggedInOnlyMiddleware = function loggedInOnlyMiddleware(req, res, next) {
  if (res.locals.loggedIn) {
    next();
  } else {
    req.flash("error", "Log in first");
    return res.redirect("/login");
  }
};

exports.loggedInOnlyMiddleware = loggedInOnlyMiddleware;

var publicOnlyMiddleware = function publicOnlyMiddleware(req, res, next) {
  if (!res.locals.loggedIn) {
    next();
  } else {
    req.flash("error", "Not permitted");
    return res.redirect("/");
  }
};

exports.publicOnlyMiddleware = publicOnlyMiddleware;
var uploadAvatars = (0, _multer["default"])({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000
  }
});
exports.uploadAvatars = uploadAvatars;
var uploadVideos = (0, _multer["default"])({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000
  }
});
exports.uploadVideos = uploadVideos;