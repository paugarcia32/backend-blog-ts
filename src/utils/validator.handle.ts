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

export const validateFormDataAndJSON =
  (schema: Schema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        req.headers["content-type"]?.includes("application/json") &&
        req.body.postData
      ) {
        // Parse and validate JSON data using the schema
        const jsonData = JSON.parse(req.body.postData);
        await schema.parse(jsonData);
      } else if (req.headers["content-type"]?.includes("multipart/form-data")) {
        // Validate FormData fields here if needed
      } else {
        throw new Error("Unsupported content type");
      }

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
