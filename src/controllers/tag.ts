import { Request, Response } from "express";
import { createTagService, getTagsService } from "../services/tag";

import { handleHttp } from "../utils/error.handle";
import { verifyToken } from "../utils/jwt.handle";
const fs = require("fs");

const createTagCtrl = async (req: Request, res: Response) => {
  try {
    const { title, id } = req.body;

    const newTag = await createTagService({ title, id });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: "Error creating tag" });
  }
};

const getTagsCtrl = async (req: Request, res: Response) => {
  try {
    const tags = await getTagsService();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tags." });
  }
};

export { createTagCtrl, getTagsCtrl };
