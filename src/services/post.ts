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

// const createPostService = async ({
//   title,
//   summary,
//   content,
//   cover,
//   authorId,
//   tags,
// }: CreatePostParams) => {
//   const tagsArray = tags.map((tag) => new Types.ObjectId(tag));

//   const postDoc = await Post.create({
//     title,
//     summary,
//     content,
//     cover,
//     author: new Types.ObjectId(authorId),
//     tag: tagsArray,
//   });

//   const postId = postDoc._id;

//   for (const tagId of tagsArray) {
//     const tagToUpdate = await Tag.findById(tagId);
//     if (!tagToUpdate) {
//       throw new Error(`El tag con ID ${tagId} no existe.`);
//     }
//     tagToUpdate.posts.push(postId);
//     await tagToUpdate.save();
//   }

//   return postDoc;
// };

// const updatePostService = async ({
//   postId,
//   title,
//   summary,
//   content,
//   authorId,
//   file,
// }: UpdatePostParams): Promise<IPost | null> => {
//   const post = await Post.findById(postId);

//   if (!post) {
//     throw new Error("El post no existe.");
//   }

//   if (post.author.toString() !== authorId) {
//     throw new Error("No tienes permiso para editar este post.");
//   }

//   post.title = title;
//   post.summary = summary;
//   post.content = content;

//   if (file) {
//     const { originalname, path } = file;
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     const newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//     post.cover = newPath;
//   }

//   const updatedPost = await post.save();
//   return updatedPost;
// };

const renameAndAddExtension = (path: string, originalname: string) => {
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  return newPath;
};

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
    cover: renameAndAddExtension(cover, "your_desired_filename"),
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
    post.cover = renameAndAddExtension(path, originalname);
  }

  const updatedPost = await post.save();
  return updatedPost;
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

const getAllPostNamesService = async (): Promise<string[]> => {
  try {
    const posts = await PostModel.find({}, "title");
    return posts.map((post: IPost) => post.title);
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los nombres de los posts.");
  }
};

export {
  getPostService,
  getAllPostsService,
  createPostService,
  getRelatedPostsService,
  getSinglePostService,
  updatePostService,
  getPostsTagsService,
  getPostsCountService,
  deletePostService,
  getAllPostNamesService,
};
