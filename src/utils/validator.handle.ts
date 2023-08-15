import { NextFunction, Request, Response } from "express";
import { Schema, ZodError } from "zod";

export const validateSchema =
  (schema: Schema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ error: error.errors.map((error) => error.message) });
      }

      return res
        .status(500)
        .json({ error: "Error en la validación del esquema" });
    }
  };
