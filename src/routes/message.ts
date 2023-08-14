import { Router } from "express";
import {
  createMessageCtrl,
  deleteMessageCtrl,
  getAllMessagesCtrl,
} from "../controllers/message";

const router = Router();

router.post("/message", createMessageCtrl);

router.get("/messages", getAllMessagesCtrl);

router.delete("/message/:id", deleteMessageCtrl);

export { router };
