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
    postId,
    autor,
    contenido,
    fecha_comentario: new Date().toISOString(),
    likes: 0,
  });

  const post = await PostModel.findById(postId);
  if (!post) {
    throw new Error("El post no existe.");
  }

  post.comments.push(newComment);
  await post.save();

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

const deleteCommentsByPostIdService = async (postId: string) => {
  try {
    // Busca y elimina los comentarios asociados al post por su ID
    await CommentModel.deleteMany({ postId });
  } catch (error) {
    console.error(error);
    throw new Error("Error al eliminar los comentarios del post.");
  }
};

const getAllCommentsService = async (): Promise<IComment[]> => {
  try {
    const comments: IComment[] = await CommentModel.find()
      .populate("postId", "title")
      .sort({ date: -1 }); // Ordena por fecha de creación en orden descendente (más nuevo primero)
    // .exec();

    return comments;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching comments");
  }
};

const addLikeService = async (commentId: string): Promise<IComment> => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updatedComment) {
      throw new Error("Comment not found");
    }

    return updatedComment;
  } catch (error) {
    console.error(error);
    throw new Error("Error adding like to comment");
  }
};

const removeLikeService = async (commentId: string): Promise<IComment> => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { $inc: { likes: -1 } },
      { new: true }
    );

    if (!updatedComment) {
      throw new Error("Comment not found");
    }

    return updatedComment;
  } catch (error) {
    console.error(error);
    throw new Error("Error removing like from comment");
  }
};

const deleteCommentService = async (commentId: string) => {
  try {
    // Encuentra y elimina el comentario por su ID
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new Error("El comentario no existe.");
    }

    return deletedComment;
  } catch (error) {
    console.error(error);
    throw new Error("Error al eliminar el comentario.");
  }
};

export {
  createCommentService,
  getCommentService,
  deleteCommentsByPostIdService,
  getAllCommentsService,
  addLikeService,
  removeLikeService,
  deleteCommentService,
};
