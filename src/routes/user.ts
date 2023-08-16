import { Router } from "express";
import {
  loginCtrl,
  logoutCtrl,
  getProfileCtrl,
  registerCtrl,
} from "../controllers/user";
import { validateSchema } from "../utils/validator.handle";
import { loginSchema, registerSchema } from "../schemas/auth";

const router = Router();

router.post("/register", validateSchema(registerSchema), registerCtrl);

router.post("/login",validateSchema(loginSchema), loginCtrl);

router.get("/profile", getProfileCtrl);

router.post("/logout", logoutCtrl);

export { router };
