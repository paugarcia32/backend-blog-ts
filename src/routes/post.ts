import { Router } from "express";
import {
  getPostsCtrl,
  getAllPosts,
  createPost,
  getSinglePostCtrl,
  updatePostCtrl,
  createCommentCtrl,
  getCommentCtrl,
  getRelatedPostsCtrl,
  getPostsTagsCtrl,
  getPostsCountCtrl,
  deletePostCtrl,
  getAllPostNamesCtrl,
} from "../controllers/post";
import { verifyTokenMiddleware } from "../utils/jwt.handle";

const multer = require("multer");
const uploadMiddleware = multer({ dest: "src/uploads/" });

const router = Router();

router.get("/post", getPostsCtrl);

router.get("/post/all", getAllPosts);

router.get("/post/count", getPostsCountCtrl);

router.get("/post/names", getAllPostNamesCtrl);

router.post("/post", uploadMiddleware.single("file"), createPost);

router.get("/post/:id", getSinglePostCtrl);

router.put("/post/:id", uploadMiddleware.single("file"), updatePostCtrl);

router.post("/post/:id/comment", createCommentCtrl);

router.get("/post/:id/comments", getCommentCtrl);

router.get("/post/:id/related", getRelatedPostsCtrl);

router.get("/posts/:tagId", getPostsTagsCtrl);

router.delete("/post/:id", verifyTokenMiddleware, deletePostCtrl);

export { router };
