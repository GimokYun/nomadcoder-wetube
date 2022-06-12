"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var videoContainer = document.getElementById("videoContainer");
var commentForm = document.getElementById("commentForm");
var commentDeleteBtn = document.querySelectorAll("#commentDeleteBtn");
var commentCount = document.getElementById("commentCount");

var addComment = function addComment(text, id, avatar, name) {
  var commentList = document.querySelector(".video__comments ul");
  var newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  var avatarDiv = document.createElement("div");
  avatarDiv.className = "video__comment-avatar";

  if (!avatar) {
    var avatarBase = document.createElement("div");
    var firstLetter = document.createElement("span");
    firstLetter.innerText = name[0];
    avatarBase.appendChild(firstLetter);
    avatarBase.className = "avatar-base avatar--small";
    avatarDiv.appendChild(avatarBase);
  } else {
    var avatarImg = document.createElement("img");
    avatarImg.src = "/".concat(avatar);
    avatarImg.className = "avatar--small";
    avatarDiv.appendChild(avatarImg);
  }

  var contentDiv = document.createElement("div");
  contentDiv.className = "video__comment-content";
  var commentOwner = document.createElement("span");
  commentOwner.className = "video__comment-owner";
  commentOwner.innerText = name;
  var commentText = document.createElement("span");
  commentText.className = "video__comment-text";
  commentText.innerText = text;
  contentDiv.appendChild(commentOwner);
  contentDiv.appendChild(commentText);
  var commentDelete = document.createElement("div");
  commentDelete.className = "video__comment-delete";
  var commentDeleteIcon = document.createElement("span");
  commentDeleteIcon.innerText = "❌";
  commentDeleteIcon.id = "commentDeleteBtn";
  commentDelete.appendChild(commentDeleteIcon);
  newComment.appendChild(avatarDiv);
  newComment.appendChild(contentDiv);
  newComment.appendChild(commentDelete);
  commentList.prepend(newComment);
};

var handleCommentSubmit = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var textArea, text, videoId, response, _yield$response$json, newCommentId, avatar, name, count;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            event.preventDefault();
            textArea = commentForm.querySelector("textarea");
            text = textArea.value;
            videoId = videoContainer.dataset.id;

            if (!(text === "")) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return");

          case 6:
            _context.next = 8;
            return fetch("/api/videos/".concat(videoId, "/comment"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                text: text
              })
            });

          case 8:
            response = _context.sent;

            if (!(response.status === 201)) {
              _context.next = 20;
              break;
            }

            textArea.value = "";
            _context.next = 13;
            return response.json();

          case 13:
            _yield$response$json = _context.sent;
            newCommentId = _yield$response$json.newCommentId;
            avatar = _yield$response$json.avatar;
            name = _yield$response$json.name;
            addComment(text, newCommentId, avatar, name);
            count = parseInt(commentCount.textContent.split(" ")[0]);

            if (count === 0) {
              commentCount.innerText = "1 Comment";
            } else {
              count = count + 1;
              commentCount.innerText = "".concat(count, " Comments");
            }

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleCommentSubmit(_x) {
    return _ref.apply(this, arguments);
  };
}();

var handleCommentDelete = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
    var commentList, id, response, count;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            commentList = event.srcElement.parentNode.parentNode;
            id = commentList.dataset.id;
            _context2.next = 4;
            return fetch("/api/comments/".concat(id, "/delete"), {
              method: "DELETE"
            });

          case 4:
            response = _context2.sent;

            if (response.status === 200) {
              commentList.remove();
              count = parseInt(commentCount.textContent.split(" ")[0]);

              if (count === 2) {
                commentCount.innerText = "1 Comment";
              } else {
                count = count - 1;
                commentCount.innerText = "".concat(count, " Comments");
              }
            }

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function handleCommentDelete(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

if (commentForm) {
  commentForm.addEventListener("submit", handleCommentSubmit);
}

if (commentDeleteBtn.length !== 0) {
  for (var i = 0; i < commentDeleteBtn.length; i++) {
    commentDeleteBtn[i].addEventListener("click", handleCommentDelete);
  }
}