import { Request, Response } from "express";
import {
  getPostService,
  getAllPostsService,
  createPostService,
  getSinglePostService,
  updatePostService,
  getPostsTagsService,
  getPostsCountService,
  deletePostService,
  getAllPostNamesService,
  getRelatedPostsService,
} from "../services/post";
import { handleHttp } from "../utils/error.handle";
import { verifyToken } from "../utils/jwt.handle";
import { deleteCommentsByPostIdService } from "../services/comment";
import { IPost } from "../interfaces/post.interface";
import { Types } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const getPostsCtrl = async (req: Request, res: Response) => {
  try {
    const { page = 1, perPage = 3 } = req.query;
    const currentPage = parseInt(page as string);
    const postsPerPage = parseInt(perPage as string);

    const { posts, totalPages } = await getPostService(
      currentPage,
      postsPerPage
    );

    const postsWithoutContent = posts.map((post) => {
      const { content, comments, updatedAt, ...postWithoutContent } =
        post.toObject();
      return postWithoutContent;
    });

    res.json({ posts: postsWithoutContent, totalPages });
  } catch (e) {
    console.error(e);
    handleHttp(res, "Error al obtener publicaciones");
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const response = await getAllPostsService();
    const postsWithoutContent = response.map((post) => {
      const { content, comments, updatedAt, ...postWithoutContent } =
        post.toObject();
      return postWithoutContent;
    });
    res.json(postsWithoutContent);
  } catch (e) {
    console.error(e);
    handleHttp(res, "Error al obtener todas publicaciones");
  }
};

const createPostCtrl = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new Error("No se recibió ningún archivo.");
    }

    const { originalname, path } = req.file;
    if (!originalname || !path) {
      throw new Error("Datos de archivo inválidos.");
    }

    verifyToken(req, res, async () => {
      const { title, summary, content, tag } = req.body;
      const tagsArray = Array.isArray(tag) ? tag : [tag];

      const authorId = req.user?.id;
      if (!authorId) {
        throw new Error("ID de autor no disponible.");
      }

      const postDoc = await createPostService({
        title,
        summary,
        content,
        cover: path,
        author: new Types.ObjectId(authorId),
        tag: tagsArray,
        comments: [],
        file: req.file as Express.Multer.File,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.json(postDoc);
    });
  } catch (error) {
    handleHttp(res, "Error al crear el post");
  }
};

const updatePostCtrl = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { title, summary, content, tag } = req.body;

    verifyToken(req, res, async () => {
      const decodedToken = req.user;
      if (!decodedToken) {
        return res.status(401).json({ error: "Token inválido" });
      }

      const updatedPost = await updatePostService({
        postId,
        title,
        summary,
        content,
        authorId: decodedToken.id,
        file: req.file,
        tag,
      });

      res.json(updatedPost);
    });
  } catch (error) {
    handleHttp(res, "Error al actualizar el post");
  }
};

const deletePostCtrl = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    await deleteCommentsByPostIdService(postId);

    const deletedPost = await deletePostService(postId);

    res.json(deletedPost);
  } catch (error) {
    console.error(error);
    handleHttp(res, "Error al eliminar el post.");
  }
};

const getSinglePostCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await getSinglePostService(id);
    res.json(response);
  } catch (error) {
    handleHttp(res, "Error get single post");
  }
};

const getRelatedPostsCtrl = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const relatedPosts = await getRelatedPostsService(postId);

    const postsWithoutContent = relatedPosts.map((post) => {
      const { content, comments, updatedAt, ...postWithoutContent } =
        post.toObject();
      return postWithoutContent;
    });

    res.json(postsWithoutContent);
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

const getPostsCountCtrl = async (req: Request, res: Response) => {
  try {
    const totalPosts = await getPostsCountService();
    res.json({ totalPosts });
  } catch (error) {
    console.error(error);
    handleHttp(res, "Error al obtener el número total de posts.");
  }
};

const getAllPostNamesCtrl = async (req: Request, res: Response) => {
  try {
    const postNames = await getAllPostNamesService();
    res.json(postNames);
  } catch (error) {
    handleHttp(res, "Error al obtener los nombres de los posts.");
  }
};

export {
  getPostsCtrl,
  getAllPosts,
  createPostCtrl,
  getRelatedPostsCtrl,
  getSinglePostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  getPostsTagsCtrl,
  getPostsCountCtrl,
  getAllPostNamesCtrl,
};
