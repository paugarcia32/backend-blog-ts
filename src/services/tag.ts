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

const deleteTagService = async (tagId: string): Promise<ITag | null> => {
  try {
    // Find the tag by its ID
    const tag = await TagModel.findById(tagId);

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Remove the tag's reference from associated posts
    await PostModel.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

    // Delete the tag
    await TagModel.deleteOne({ _id: tagId });

    return tag;
  } catch (error) {
    throw error;
  }
};

const updateTagService = async (
  tagId: string,
  newTitle: string
): Promise<ITag | null> => {
  try {
    // Find the tag by its ID
    const tag = await TagModel.findById(tagId);

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Update the tag's title
    tag.title = newTitle;
    await tag.save();

    return tag;
  } catch (error) {
    throw error;
  }
};

const getTagCountService = async (): Promise<number> => {
  try {
    const tagCount = await TagModel.countDocuments();
    return tagCount;
  } catch (error) {
    throw error;
  }
};

const getTagByIdService = async (tagId: string) => {
  try {
    const tag = await TagModel.findById(tagId);
    return tag;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching tag by ID");
  }
};

export {
  createTagService,
  getTagsService,
  deleteTagService,
  updateTagService,
  getTagCountService,
  getTagByIdService,
};
