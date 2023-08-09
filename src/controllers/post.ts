import { Request, Response } from "express";
import {
  getPostService,
  getAllPostsService,
  createPostService,
  getSinglePostService,
} from "../services/post";
import { handleHttp } from "../utils/error.handle";
import { verifyToken } from "../utils/jwt.handle";
const fs = require("fs");

const getPosts = async (req: Request, res: Response) => {
  try {
    const { currentPage, postsPerPage } = req.query;
    const response = await getPostService(
      Number(currentPage),
      Number(postsPerPage)
    );

    res.json({ response });
  } catch (e) {
    console.error(e);
    handleHttp(res, "Error al obtener publicaciones");
  }
};
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const response = await getAllPostsService();
    res.json(response);
  } catch (e) {
    console.error(e);
    handleHttp(res, "Error al obtener todas publicaciones");
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new Error("No file received.");
    }

    const { originalname, path } = req.file;
    if (!originalname || !path) {
      throw new Error("Invalid file data received.");
    }

    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    verifyToken(req, res, async () => {
      const { title, summary, content, tag } = req.body;
      const tagsArray = Array.isArray(tag) ? tag : [tag];

      const postDoc = await createPostService({
        title,
        summary,
        content,
        cover: newPath,
        authorId: req.user?.id || "", // Usar el ID del usuario del token
        tags: tagsArray,
      });

      res.json(postDoc);
    });
  } catch (error) {
    handleHttp(res, "Error al crear post");
  }
};

const getSinglePostCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await getSinglePostService(id); // ¡Asegúrate de agregar await aquí!
    res.json(response);
  } catch (error) {
    handleHttp(res, "ERROR_UPDATE_CHALLENGE");
  }
};

export { getPosts, getAllPosts, createPost, getSinglePostCtrl };
