import { Router } from "express";

import { verifyTokenMiddleware } from "../utils/jwt.handle";
import {
  createCommentCtrl,
  getCommentCtrl,
  addLikeCtrl,
  deleteCommentCtrl,
  getAllCommentsCtrl,
  removeLikeCtrl,
} from "../controllers/comment";
import { validateSchema } from "../utils/validator.handle";
import { createCommentSchema } from "../schemas/comment";

const router = Router();

router.post(
  "/post/:id/comment",
  validateSchema(createCommentSchema),
  createCommentCtrl
);

router.get("/post/:id/comments", getCommentCtrl);

router.get("/comments", getAllCommentsCtrl);

router.post("/comment/:id/like", addLikeCtrl);

router.post("/comment/:id/dislike", removeLikeCtrl);

router.delete("/comment/:id", deleteCommentCtrl);
export { router };
