import Post from "../models/Post";
import { Types } from "mongoose";
import { ITag } from "../interfaces/tag.interface";
import { IUser } from "../interfaces/user.interface";
import { IPost } from "../interfaces/post.interface";
import Tag from "../models/Tag";
import CommentModel from "../models/Comment";
import PostModel from "../models/Post";
import { IComment } from "../interfaces/comment.interface";
const fs = require("fs");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const getPostService = async (
  currentPage: number,
  postsPerPage: number
): Promise<{ posts: IPost[]; totalPages: number }> => {
  try {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const posts = await Post.find({})
      .populate("author", ["username"])
      .populate("tag", ["title"])
      .sort({ createdAt: -1 })
      .skip(indexOfFirstPost)
      .limit(postsPerPage);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return { posts, totalPages }; // Devolver la respuesta en un objeto con las propiedades 'posts' y 'totalPages'
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
  return posts; // Devolver directamente el array de posts
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

const getSinglePostService = async (id: string): Promise<IPost | null> => {
  const postDoc = await Post.findById(id)
    .populate("author", ["username"])
    .populate("tag", ["title"]);

  return postDoc;
};

interface UpdatePostParams {
  postId: string;
  title: string;
  summary: string;
  content: string;
  authorId: string;
  file?: Express.Multer.File;
}

const updatePostService = async ({
  postId,
  title,
  summary,
  content,
  authorId,
  file,
}: UpdatePostParams): Promise<IPost | null> => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("El post no existe.");
  }

  if (post.author.toString() !== authorId) {
    throw new Error("No tienes permiso para editar este post.");
  }

  post.title = title;
  post.summary = summary;
  post.content = content;

  if (file) {
    const { originalname, path } = file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    post.cover = newPath;
  }

  const updatedPost = await post.save();
  return updatedPost;
};

const createCommentService = async ({
  postId,
  autor,
  contenido,
}: {
  postId: string;
  autor: string;
  contenido: string;
}): Promise<IComment> => {
  const newComment = new CommentModel({
    autor,
    contenido,
    fecha_comentario: new Date().toISOString(),
    likes: 0,
  });

  const post = await PostModel.findById(postId);
  if (!post) {
    throw new Error("El post no existe.");
  }

  // Agregar el nuevo comentario al post y guardar el post actualizado
  post.comments.push(newComment);
  await post.save();

  // Guardar el comentario en la colección de comentarios
  await newComment.save();

  return newComment;
};

const getCommentService = async (postId: string) => {
  const postWithComments = await PostModel.findById(postId)
    .populate("comments")
    .exec();

  if (!postWithComments) {
    throw new Error("El post no existe.");
  }

  const comments = postWithComments.comments as IComment[];
  return comments;
};

const getRelatedPostsService = async (postId: string) => {
  const post = await PostModel.findById(postId).populate("tag");

  if (!post) {
    throw new Error("El post no existe.");
  }

  const postTags = post.tag.map((tag) => tag._id);

  const relatedPosts = await PostModel.find({
    _id: { $ne: postId },
    tag: { $in: postTags },
  })
    .populate("author", ["username"])
    .populate("tag", ["title"])
    .limit(5)
    .sort({ createdAt: -1 });

  return relatedPosts as IPost[];
};

const getPostsTagsService = async (tagId: string) => {
  const posts = await PostModel.find({ tag: tagId })
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);

  if (posts.length === 0) {
    throw new Error("No se encontraron publicaciones con este tag.");
  }

  return posts as IPost[];
};

export {
  getPostService,
  getAllPostsService,
  createPostService,
  getSinglePostService,
  updatePostService,
  createCommentService,
  getCommentService,
  getRelatedPostsService,
  getPostsTagsService,
};
