import Post from "../models/Post";
import { Types } from "mongoose";
import { ITag } from "../interfaces/tag.interface";
import { IUser } from "../interfaces/user.interface";
import { IPost } from "../interfaces/post.interface";
import Tag from "../models/Tag";
const fs = require("fs");

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

const getAllPostsService = async () => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .populate("tag", ["title"])
    .sort({ createdAt: -1 });
  return { posts };
};

interface CreatePostParams {
  title: string;
  summary: string;
  content: string;
  cover: string;
  authorId: string;
  tags: string[];
}

const createPostService = async ({
  title,
  summary,
  content,
  cover,
  authorId,
  tags,
}: CreatePostParams) => {
  const tagsArray = tags.map((tag) => new Types.ObjectId(tag));

  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover,
    author: new Types.ObjectId(authorId),
    tag: tagsArray,
  });

  const postId = postDoc._id;

  for (const tagId of tagsArray) {
    const tagToUpdate = await Tag.findById(tagId);
    if (!tagToUpdate) {
      throw new Error(`El tag con ID ${tagId} no existe.`);
    }
    tagToUpdate.posts.push(postId);
    await tagToUpdate.save();
  }

  return postDoc;
};

export { getPostService, getAllPostsService, createPostService };
