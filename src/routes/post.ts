import { Router } from "express";
import {
  getPosts,
  getAllPosts,
  createPost,
  getSinglePostCtrl,
  updatePostCtrl,
  createCommentCtrl,
  getCommentCtrl,
} from "../controllers/post";

const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const router = Router();

router.get("/post", getPosts);

router.get("/post/all", getAllPosts);

router.post("/post", uploadMiddleware.single("file"), createPost);

router.get("/post/:id", getSinglePostCtrl);

router.put("/post/:id", uploadMiddleware.single("file"), updatePostCtrl);

router.post("/post/:id/comment", createCommentCtrl);

router.get("/post/:id/comments", getCommentCtrl);

export { router };
