import { Request, Response } from "express";
import {
  getPostService,
  getAllPostsService,
  createPostService,
} from "../services/post";
import { handleHttp } from "../utils/error.handle";

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
const getAllPosts = async (req: Request, res: Response) => {};

const createPost = async (req: Request, res: Response) => {};

export { getPosts, getAllPosts, createPost };
