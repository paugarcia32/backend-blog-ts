import { Router } from "express";
import { getPosts, getAllPosts, createPost } from "../controllers/post";

const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const router = Router();

router.get("/post", getPosts);

router.get("/post/all", getAllPosts);

router.post("/post", uploadMiddleware.single("file"), createPost);

export { router };
