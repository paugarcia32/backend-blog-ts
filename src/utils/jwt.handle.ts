import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { username: string; id: string }; // Define la propiedad 'user'
    }
  }
}

const secretKey = process.env.SECRET_KEY || "yourSecretKey"; // Asegúrate de ajustar la clave secreta

const generateToken = (data: JwtPayload): string => {
  return jwt.sign(data, secretKey);
};

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    return next(new Error("Token no proporcionado"));
  }

  try {
    const decoded = jwt.verify(token, secretKey) as {
      username: string;
      id: string;
    };

    req.user = decoded; // Ahora puedes agregar 'user' al objeto 'req'
    next();
  } catch (err) {
    console.error("Error verifying JWT:", err);
    next(new Error("Token inválido"));
  }
};

export { verifyToken, generateToken };
