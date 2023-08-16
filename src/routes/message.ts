import { Router } from "express";
import {
  createMessageCtrl,
  deleteMessageCtrl,
  getAllMessagesCtrl,
} from "../controllers/message";
import { validateSchema } from "../utils/validator.handle";
import { createMessageSchema } from "../schemas/message";

const router = Router();

router.post("/message", validateSchema(createMessageSchema), createMessageCtrl);

router.get("/messages", getAllMessagesCtrl);

router.delete("/message/:id", deleteMessageCtrl);

export { router };
