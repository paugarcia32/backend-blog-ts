import { IUser } from "../interfaces/user.interface";
import UserModel from "../models/User";
import { generateToken, verifyToken } from "../utils/jwt.handle";
import { hashPassword, comparePassword } from "../utils/bcrypt.handle";

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const registerNewUser = async ({ username, password }: IUser) => {
  const checkIs = await UserModel.findOne({ username });
  if (checkIs) return "ALREDY_USER";
  const passHash = await hashPassword(password);
  const registerNewUser = await UserModel.create({
    username,
    password: passHash,
  });
  return registerNewUser;
};

const loginUser = async ({ username, password }: IUser) => {
  try {
    const checkIs = await UserModel.findOne({ username });
    if (!checkIs) return "USER_DOES_NOT_EXIST";

    const isCorrect = await comparePassword(password, checkIs.password);
    if (!isCorrect) return "PASSWORD_INCORRECT";

    if (isCorrect) {
      const token = generateToken({ username, id: checkIs._id });
      return {
        id: checkIs._id,
        username,
      };
    }
  } catch (error) {
    throw new Error("Error during login");
  }
};

const getProfileInfo = async (userId: string): Promise<IUser | null> => {
  try {
    // Aquí deberías implementar la lógica para obtener el perfil del usuario
    const user = await UserModel.findById(userId);

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el perfil del usuario.");
  }
};

export { registerNewUser, loginUser, getProfileInfo };
