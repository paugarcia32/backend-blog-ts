import { Router } from "express";
import {
  loginCtrl,
  logoutCtrl,
  getProfileCtrl,
  registerCtrl,
} from "../controllers/user";
import { verifyToken } from "../utils/jwt.handle";

const router = Router();

router.post("/register", registerCtrl);

router.post("/login", loginCtrl);

router.get("/profile", getProfileCtrl);

router.post("/logout", logoutCtrl);

export { router };
