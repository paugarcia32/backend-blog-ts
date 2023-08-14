import { Request, Response } from "express";

import { handleHttp } from "../utils/error.handle";
import { verifyToken } from "../utils/jwt.handle";
import fs from "fs";
import {
  createCommentService,
  getCommentService,
  deleteCommentsByPostIdService,
  addLikeService,
  deleteCommentService,
  getAllCommentsService,
  removeLikeService,
} from "../services/comment";
import { deletePostService } from "../services/post";
const createCommentCtrl = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { autor, contenido } = req.body;

    const newComment = await createCommentService({
      postId,
      autor,
      contenido,
    });

    res.json(newComment);
  } catch (error) {
    handleHttp(res, "Error al crear el comentario");
  }
};

const getCommentCtrl = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const comments = await getCommentService(postId);
    res.json(comments);
  } catch (error) {
    handleHttp(res, "Error al obtener los comentarios.");
  }
};

const getAllCommentsCtrl = async (req: Request, res: Response) => {
  try {
    const comments = await getAllCommentsService();
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching comments" });
  }
};

const addLikeCtrl = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const updatedComment = await addLikeService(commentId);

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding like to comment" });
  }
};

const removeLikeCtrl = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const updatedComment = await removeLikeService(commentId);

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing like from comment" });
  }
};

const deleteCommentCtrl = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const deletedComment = await deleteCommentService(commentId);

    res.json(deletedComment);
  } catch (error) {
    console.error(error);
    handleHttp(res, "Error al eliminar el comentario.");
  }
};

export {
  createCommentCtrl,
  getCommentCtrl,
  getAllCommentsCtrl,
  addLikeCtrl,
  removeLikeCtrl,
  deleteCommentCtrl,
};
