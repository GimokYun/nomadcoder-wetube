"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watch = exports.search = exports.registerView = exports.postUpload = exports.postEdit = exports.home = exports.getUpload = exports.getEdit = exports.deleteVideo = exports.deleteComment = exports.createComment = void 0;

var _Video = _interopRequireDefault(require("../models/Video"));

var _User = _interopRequireDefault(require("../models/User"));

var _Comment = _interopRequireDefault(require("../models/Comment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var home = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var videos;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _Video["default"].find({}).populate("owner");

          case 2:
            videos = _context.sent;
            return _context.abrupt("return", res.render("home", {
              pageTitle: "Home",
              videos: videos
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function home(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.home = home;

var watch = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var id, video, comments, i, comment, commentOwner;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.next = 3;
            return _Video["default"].findById(id).populate("owner").populate("comments");

          case 3:
            video = _context2.sent;

            if (video) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 6:
            comments = video.comments;
            i = 0;

          case 8:
            if (!(i < video.comments.length)) {
              _context2.next = 17;
              break;
            }

            comment = comments[i];
            _context2.next = 12;
            return _User["default"].findById(comment.owner);

          case 12:
            commentOwner = _context2.sent;
            comments[i].owner = commentOwner;

          case 14:
            i++;
            _context2.next = 8;
            break;

          case 17:
            return _context2.abrupt("return", res.render("watch", {
              pageTitle: video.title,
              video: video,
              comments: comments
            }));

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function watch(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.watch = watch;

var getEdit = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var id, _id, video;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id, _id = req.session.user._id;
            _context3.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context3.sent;

            if (video) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 6:
            if (!(String(video.owner) !== _id)) {
              _context3.next = 9;
              break;
            }

            req.flash("error", "Not permitted");
            return _context3.abrupt("return", res.status(403).redirect("/"));

          case 9:
            return _context3.abrupt("return", res.render("edit", {
              pageTitle: "Editing",
              video: video
            }));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getEdit(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getEdit = getEdit;

var postEdit = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var id, _req$body, title, description, hashtags, _id, video;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id, _req$body = req.body, title = _req$body.title, description = _req$body.description, hashtags = _req$body.hashtags, _id = req.session.user._id;
            _context4.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context4.sent;

            if (video) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 6:
            if (!(String(video.owner) !== _id)) {
              _context4.next = 9;
              break;
            }

            req.flash("error", "Not permitted");
            return _context4.abrupt("return", res.status(403).redirect("/"));

          case 9:
            _context4.next = 11;
            return _Video["default"].findByIdAndUpdate(id, {
              title: title,
              description: description,
              hashtags: _Video["default"].formatHashtags(hashtags)
            });

          case 11:
            req.flash("success", "Video updated");
            return _context4.abrupt("return", res.redirect("/videos/".concat(id)));

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function postEdit(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.postEdit = postEdit;

var getUpload = function getUpload(req, res) {
  return res.render("upload", {
    pageTitle: "Upload Video"
  });
};

exports.getUpload = getUpload;

var postUpload = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _req$body2, title, description, hashtags, _req$files, video, thumbnail, _id, newVideo, user;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, hashtags = _req$body2.hashtags, _req$files = req.files, video = _req$files.video, thumbnail = _req$files.thumbnail, _id = req.session.user._id;
            _context5.prev = 1;
            _context5.next = 4;
            return _Video["default"].create({
              title: title,
              fileUrl: video[0].path,
              thumbnailUrl: thumbnail[0].path,
              description: description,
              hashtags: _Video["default"].formatHashtags(hashtags),
              meta: {
                views: 0,
                ratings: 0
              },
              owner: _id
            });

          case 4:
            newVideo = _context5.sent;
            _context5.next = 7;
            return _User["default"].findById(_id);

          case 7:
            user = _context5.sent;
            user.videos.push(newVideo._id);
            user.save();
            req.flash("success", "Video uploaded");
            return _context5.abrupt("return", res.redirect("/"));

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](1);
            return _context5.abrupt("return", res.status(400).render("upload", {
              pageTitle: "Upload Video",
              errorMessage: _context5.t0._message
            }));

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 14]]);
  }));

  return function postUpload(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.postUpload = postUpload;

var deleteVideo = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var id, _id, video, user;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id, _id = req.session.user._id;
            _context6.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context6.sent;
            _context6.next = 6;
            return _User["default"].findById(_id);

          case 6:
            user = _context6.sent;

            if (video) {
              _context6.next = 9;
              break;
            }

            return _context6.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 9:
            if (!(String(video.owner) !== _id)) {
              _context6.next = 12;
              break;
            }

            req.flash("error", "Not permitted");
            return _context6.abrupt("return", res.status(403).redirect("/"));

          case 12:
            _context6.next = 14;
            return _Video["default"].findByIdAndDelete(id);

          case 14:
            user.videos.splice(user.videos.indexOf(id), 1);
            user.save();
            req.flash("success", "Video deleted");
            return _context6.abrupt("return", res.redirect("/"));

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function deleteVideo(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deleteVideo = deleteVideo;

var search = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var keyword, videos;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            keyword = req.query.keyword;
            videos = [];

            if (!keyword) {
              _context7.next = 6;
              break;
            }

            _context7.next = 5;
            return _Video["default"].find({
              title: {
                $regex: new RegExp(keyword, "i")
              }
            }).populate("owner");

          case 5:
            videos = _context7.sent;

          case 6:
            return _context7.abrupt("return", res.render("search", {
              pageTitle: "Search",
              videos: videos
            }));

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function search(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.search = search;

var registerView = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var id, video;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id;
            _context8.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context8.sent;

            if (video) {
              _context8.next = 6;
              break;
            }

            return _context8.abrupt("return", res.sendStatus(404));

          case 6:
            video.meta.views = video.meta.views + 1;
            _context8.next = 9;
            return video.save();

          case 9:
            return _context8.abrupt("return", res.sendStatus(200));

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function registerView(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.registerView = registerView;

var createComment = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    var id, text, user, video, comment;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            id = req.params.id, text = req.body.text, user = req.session.user;
            _context9.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context9.sent;

            if (video) {
              _context9.next = 6;
              break;
            }

            return _context9.abrupt("return", res.sendStatus(404));

          case 6:
            _context9.next = 8;
            return _Comment["default"].create({
              text: text,
              owner: user._id,
              video: id
            });

          case 8:
            comment = _context9.sent;
            video.comments.push(comment);
            video.save();
            return _context9.abrupt("return", res.status(201).json({
              newCommentId: comment._id,
              avatar: user.avatarUrl,
              name: user.name
            }));

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function createComment(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.createComment = createComment;

var deleteComment = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
    var id, user, comment, video;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = req.params.id, user = req.session.user;
            _context10.next = 3;
            return _Comment["default"].findById(id).populate("owner");

          case 3:
            comment = _context10.sent;

            if (!(!comment || String(user._id) !== String(comment.owner._id))) {
              _context10.next = 6;
              break;
            }

            return _context10.abrupt("return", res.sendStatus(404));

          case 6:
            _context10.next = 8;
            return _Video["default"].findById(comment.video);

          case 8:
            video = _context10.sent;

            if (video) {
              _context10.next = 11;
              break;
            }

            return _context10.abrupt("return", res.sendStatus(404));

          case 11:
            video.comments.splice(video.comments.indexOf(id), 1);
            _context10.next = 14;
            return video.save();

          case 14:
            _context10.next = 16;
            return _Comment["default"].findByIdAndDelete(id);

          case 16:
            return _context10.abrupt("return", res.sendStatus(200));

          case 17:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function deleteComment(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

exports.deleteComment = deleteComment;