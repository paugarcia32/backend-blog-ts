import { Router } from "express";
import { createMessageCtrl, getAllMessagesCtrl } from "../controllers/message";

const router = Router();

router.post("/message", createMessageCtrl);

router.get("/messages", getAllMessagesCtrl);

export { router };
