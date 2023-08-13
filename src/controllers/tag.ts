import { Request, Response } from "express";
import {
  createTagService,
  getTagsService,
  deleteTagService,
  updateTagService,
  getTagCountService,
  getTagByIdService,
} from "../services/tag";

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

const deleteTagCtrl = async (req: Request, res: Response) => {
  try {
    const tagId = req.params.tagId;

    const deletedTag = await deleteTagService(tagId);
    res.json({ message: "Tag deleted successfully", deletedTag });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tag" });
  }
};

const updateTagCtrl = async (req: Request, res: Response) => {
  try {
    const tagId = req.params.tagId;
    const { title } = req.body;

    const updatedTag = await updateTagService(tagId, title);
    res.json({ message: "Tag updated successfully", updatedTag });
  } catch (error) {
    res.status(500).json({ message: "Error updating tag" });
  }
};

const getTagCountCtrl = async (req: Request, res: Response) => {
  try {
    const tagCount = await getTagCountService();
    res.json({ tagCount });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tag count" });
  }
};

const getTagByIdCtrl = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;
    const tag = await getTagByIdService(tagId);
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tag by ID" });
  }
};

export {
  createTagCtrl,
  getTagsCtrl,
  deleteTagCtrl,
  updateTagCtrl,
  getTagCountCtrl,
  getTagByIdCtrl,
};
