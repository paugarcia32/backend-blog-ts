import { Request, Response } from "express";
import {
  getPostService,
  getAllPostsService,
  createPostService,
  getSinglePostService,
  updatePostService,
  createCommentService,
  getCommentService,
  getRelatedPostsService,
  getPostsTagsService,
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

const updatePostCtrl = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { title, summary, content } = req.body;

    // Verificar si el usuario está autenticado
    verifyToken(req, res, async () => {
      // Marca esta función como async
      const decodedToken = req.user; // Aquí ya tienes el usuario decodificado
      if (!decodedToken) {
        return res.status(401).json({ error: "Token inválido" });
      }

      // Actualizar el post utilizando el servicio
      const updatedPost = await updatePostService({
        postId,
        title,
        summary,
        content,
        authorId: decodedToken.id,
        file: req.file,
      });

      res.json(updatedPost);
    });
  } catch (error) {
    handleHttp(res, "Error al actualizar el post");
  }
};

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

const getRelatedPostsCtrl = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const relatedPosts = await getRelatedPostsService(postId);
    res.json(relatedPosts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts relacionados." });
  }
};

const getPostsTagsCtrl = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;

    const posts = await getPostsTagsService(tagId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las publicaciones." });
  }
};

export {
  getPosts,
  getAllPosts,
  createPost,
  getSinglePostCtrl,
  updatePostCtrl,
  createCommentCtrl,
  getCommentCtrl,
  getRelatedPostsCtrl,
  getPostsTagsCtrl,
};
