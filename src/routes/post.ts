import { Router } from "express";
import {
  getPosts,
  getAllPosts,
  createPost,
  getSinglePostCtrl,
} from "../controllers/post";

const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const router = Router();

router.get("/post", getPosts);

router.get("/post/all", getAllPosts);

router.post("/post", uploadMiddleware.single("file"), createPost);

router.get("/post/:id", getSinglePostCtrl);

export { router };
