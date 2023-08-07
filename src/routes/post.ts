import { Router } from "express";
import { getPosts, getAllPosts } from "../controllers/post";
const router = Router();

router.get("/post", getPosts);

router.get("/post/all", getAllPosts);

export { router };
