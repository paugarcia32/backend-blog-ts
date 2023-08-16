import { Router } from "express";
import {
  getPostsCtrl,
  getAllPosts,
  createPostCtrl,
  getSinglePostCtrl,
  updatePostCtrl,
  getPostsTagsCtrl,
  getPostsCountCtrl,
  deletePostCtrl,
  getAllPostNamesCtrl,
  getRelatedPostsCtrl,
} from "../controllers/post";
import { verifyTokenMiddleware } from "../utils/jwt.handle";
import {
  validateFormDataAndJSON,
  validateSchema,
} from "../utils/validator.handle";
import { createPostSchema } from "../schemas/post";

const multer = require("multer");
const uploadMiddleware = multer({ dest: "src/uploads/" });

const router = Router();

router.get("/post", getPostsCtrl);

router.get("/post/all", getAllPosts);

router.get("/post/count", getPostsCountCtrl);

router.get("/post/names", getAllPostNamesCtrl);

router.post("/post", uploadMiddleware.single("file"), createPostCtrl);

router.put("/post/:id", uploadMiddleware.single("file"), updatePostCtrl);

router.get("/post/:id", getSinglePostCtrl);

router.get("/post/:id/related", getRelatedPostsCtrl);

router.get("/posts/:tagId", getPostsTagsCtrl);

router.delete("/post/:id", verifyTokenMiddleware, deletePostCtrl);

export { router };
