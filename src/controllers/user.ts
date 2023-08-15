import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";
import { loginUser, registerNewUser } from "../services/auth";
import { IUser } from "../interfaces/user.interface";
import { generateToken, verifyToken } from "../utils/jwt.handle";
import jwt from "jsonwebtoken";
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const secret = process.env.SECRET_KEY || "wzesxvbhjbascdsfsdfgs";

const registerCtrl = async ({ body }: Request, res: Response) => {
  try {
    const response = await registerNewUser(body as IUser);
    if (response === "ALREDY_USER") {
      res.status(220);
      res.send(response);
    } else {
      res.send(response);
    }
  } catch (e) {
    handleHttp(res, "ERROR_SIGNUP");
  }
};

const loginCtrl = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const responseUser = await loginUser({ username, password } as IUser);

    if (typeof responseUser === "object") {
      if (responseUser.id && responseUser.username) {
        const token = generateToken(responseUser);
        res.cookie("token", token).json({ responseUser });
      } else {
        res.status(400).send(responseUser);
      }
    } else {
      res.status(400).send(responseUser);
    }
  } catch (error) {
    handleHttp(res, "ERROR_LOGIN");
  }
};

const getProfileCtrl = (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      username: string;
      id: string;
      iat: number;
    };

    res.json(decoded);
  } catch (err) {
    console.error("Error verifying JWT:", err);
    res.status(500).json({ message: "Error al verificar el token" });
  }
};

const logoutCtrl = (req: Request, res: Response) => {
  try {
    res.clearCookie("token").json("ok");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

export { registerCtrl, loginCtrl, getProfileCtrl, logoutCtrl };
