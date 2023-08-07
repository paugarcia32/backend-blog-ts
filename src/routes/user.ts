import { Router } from "express";
import {
  loginCtrl,
  logoutCtrl,
  profileCtrl,
  registerCtrl,
} from "../controllers/user";
import { verifyToken } from "../utils/jwt.handle";

const router = Router();

router.post("/register", registerCtrl);

router.post("/login", loginCtrl);

router.get("/profile", verifyToken, profileCtrl);

router.post("/", logoutCtrl);

export { router };
