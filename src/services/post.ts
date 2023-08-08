import Post from "../models/Post";
import { Types } from "mongoose";
import { ITag } from "../interfaces/tag.interface";
import { IUser } from "../interfaces/user.interface";
import { IPost } from "../interfaces/post.interface";
import Tag from "../models/Tag";

const getPostService = async (currentPage: number, postsPerPage: number) => {
  try {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const responseItem = await Post.find({})
      .populate("author", ["username"])
      .populate("tag", ["title"])
      .sort({ createdAt: -1 })
      .skip(indexOfFirstPost)
      .limit(postsPerPage);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return { responseItem, totalPages };
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener las publicaciones.");
  }
};

const getAllPostsService = async () => {};

const createPostService = async () => {};

export { getPostService, getAllPostsService, createPostService };
