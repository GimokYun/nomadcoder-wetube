import express from "express";
import { see, logout, getEdit, startGithubLogin, finishGithubLogin, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { loggedInOnlyMiddleware, publicOnlyMiddleware, uploadAvatars } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", see);
userRouter.get("/logout", loggedInOnlyMiddleware, logout);
userRouter.route("/edit").all(loggedInOnlyMiddleware).get(getEdit).post(uploadAvatars.single("avatar"), postEdit);
userRouter.route("/change-password").all(loggedInOnlyMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
