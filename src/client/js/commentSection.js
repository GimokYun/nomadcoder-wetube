const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const commentDeleteBtn = document.querySelectorAll("#commentDeleteBtn");
const commentCount = document.getElementById("commentCount");

const addComment = (text, id, avatar, name) => {
    const commentList = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;

    const avatarDiv = document.createElement("div");
    avatarDiv.className = "video__comment-avatar";
    if (!avatar) {
        const avatarBase = document.createElement("div");
        const firstLetter = document.createElement("span");
        firstLetter.innerText = name[0];
        avatarBase.appendChild(firstLetter);
        avatarBase.className = "avatar-base avatar--small";
        avatarDiv.appendChild(avatarBase);
    } else {
        const avatarImg = document.createElement("img");
        avatarImg.src = `/${avatar}`;
        avatarImg.className = "avatar--small";
        avatarDiv.appendChild(avatarImg);
    }

    const contentDiv = document.createElement("div");
    contentDiv.className = "video__comment-content";
    const commentOwner = document.createElement("span");
    commentOwner.className = "video__comment-owner";
    commentOwner.innerText = name;
    const commentText = document.createElement("span");
    commentText.className = "video__comment-text";
    commentText.innerText = text;
    contentDiv.appendChild(commentOwner);
    contentDiv.appendChild(commentText);

    const commentDelete = document.createElement("div");
    commentDelete.className = "video__comment-delete";
    const commentDeleteIcon = document.createElement("span");
    commentDeleteIcon.innerText = "❌";
    commentDeleteIcon.id = "commentDeleteBtn";
    commentDelete.appendChild(commentDeleteIcon);

    newComment.appendChild(avatarDiv);
    newComment.appendChild(contentDiv);
    newComment.appendChild(commentDelete);
    commentList.prepend(newComment);
};

const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const textArea = commentForm.querySelector("textarea");
    const text = textArea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    if (response.status === 201) {
        textArea.value = "";
        const { newCommentId, avatar, name} = await response.json();
        addComment(text, newCommentId, avatar, name);
        let count = parseInt(commentCount.textContent.split(" ")[0]);
        if (count === 0) {
            commentCount.innerText = "1 Comment";
        } else {
            count = count + 1;
            commentCount.innerText = `${count} Comments`;
        }
    }
};

const handleCommentDelete = async (event) => {
    const commentList = event.srcElement.parentNode.parentNode;
    const { id } = commentList.dataset;
    const response = await fetch(`/api/comments/${id}/delete`, {
        method: "DELETE"
    });
    if (response.status === 200) {
        commentList.remove();
        let count = parseInt(commentCount.textContent.split(" ")[0]);
        if (count === 2) {
            commentCount.innerText = "1 Comment";
        } else {
            count = count - 1;
            commentCount.innerText = `${count} Comments`;
        }
    }
};

if (commentForm) {
    commentForm.addEventListener("submit", handleCommentSubmit);
}

if (commentDeleteBtn.length !== 0) {
    for (let i = 0 ; i < commentDeleteBtn.length ; i++) {
        commentDeleteBtn[i].addEventListener("click", handleCommentDelete);
    }
}
