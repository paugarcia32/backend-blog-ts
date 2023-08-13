import { Router } from "express";

import {
  createTagCtrl,
  getTagsCtrl,
  deleteTagCtrl,
  updateTagCtrl,
  getTagCountCtrl,
  getTagByIdCtrl,
} from "../controllers/tag";
import { verifyTokenMiddleware } from "../utils/jwt.handle";

const router = Router();

router.post("/tags", verifyTokenMiddleware, createTagCtrl);

router.get("/tags", getTagsCtrl);

router.delete("/tags/:tagId", verifyTokenMiddleware, deleteTagCtrl);

router.put("/tags/:tagId", verifyTokenMiddleware, updateTagCtrl);

router.get("/tags/count", getTagCountCtrl);

router.get("/tags/:tagId", getTagByIdCtrl);
export { router };
