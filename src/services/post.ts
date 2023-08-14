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

    return { posts, totalPages };
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
  return posts;
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

const getPostsCountService = async () => {
  try {
    const totalPosts = await Post.countDocuments();
    return totalPosts;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el número total de posts.");
  }
};

const deletePostService = async (postId: string) => {
  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new Error("El post no existe.");
    }

    const tagsArray: Types.ObjectId[] = post.tag
      .filter((tag) => tag instanceof Types.ObjectId)
      .map((tagId) => tagId as Types.ObjectId);

    for (const tagId of tagsArray) {
      const tagToUpdate = await Tag.findById(tagId);
      if (tagToUpdate) {
        tagToUpdate.posts = tagToUpdate.posts.filter(
          (post) => post.toString() !== postId
        );
        await tagToUpdate.save();
      }
    }

    await post.deleteOne();

    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Error al eliminar el post.");
  }
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

const getAllPostNamesService = async (): Promise<string[]> => {
  try {
    const posts = await PostModel.find({}, "title");
    return posts.map((post: IPost) => post.title);
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los nombres de los posts.");
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
  getPostService,
  getAllPostsService,
  createPostService,
  getSinglePostService,
  updatePostService,
  createCommentService,
  getCommentService,
  getRelatedPostsService,
  getPostsTagsService,
  getPostsCountService,
  deletePostService,
  deleteCommentsByPostIdService,
  getAllPostNamesService,
  getAllCommentsService,
  addLikeService,
  removeLikeService,
  deleteCommentService,
};
