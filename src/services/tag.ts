import Post from "../models/Post";
import { Types } from "mongoose";
import { ITag } from "../interfaces/tag.interface";
import { IUser } from "../interfaces/user.interface";
import { IPost } from "../interfaces/post.interface";
import TagModel from "../models/Tag";
import CommentModel from "../models/Comment";
import PostModel from "../models/Post";
import { IComment } from "../interfaces/comment.interface";
const fs = require("fs");

const createTagService = async ({
  title,
  id,
}: {
  title: string;
  id: string;
}) => {
  const newTag = await TagModel.create({ title, id });
  return newTag as ITag;
};

const getTagsService = async (): Promise<ITag[]> => {
  const tags = await TagModel.find();
  return tags;
};
export { createTagService, getTagsService };
