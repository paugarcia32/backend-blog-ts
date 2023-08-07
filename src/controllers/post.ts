import { Request, Response } from "express";
import { getPost, getAllPostsService } from "../services/post";

const getPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, perPage = 3 } = req.query;
    const currentPage = parseInt(page as string);
    const postsPerPage = parseInt(perPage as string);

    // Obtener las publicaciones usando el servicio
    const result = await getPost(currentPage, postsPerPage);

    // Comprueba si hay publicaciones en el resultado
    if (result.posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron publicaciones." });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las publicaciones." });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPostsService();

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron publicaciones." });
    }

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las publicaciones." });
  }
};

export { getPosts, getAllPosts };
