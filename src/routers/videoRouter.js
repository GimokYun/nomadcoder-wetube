import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController";
import { loggedInOnlyMiddleware, uploadVideos } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(loggedInOnlyMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(loggedInOnlyMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(loggedInOnlyMiddleware).get(getUpload).post(uploadVideos.fields([
    {name: "video", maxCount: 1}, {name: "thumbnail", maxCount: 1},
]), postUpload);

export default videoRouter;
