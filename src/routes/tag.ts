import { Router } from "express";

import { createTagCtrl, getTagsCtrl } from "../controllers/tag";

const router = Router();

router.post("/tags", createTagCtrl);

router.get("/tags", getTagsCtrl);
export { router };
