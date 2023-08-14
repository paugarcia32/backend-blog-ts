import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";
import { ITag } from "./tag.interface";
import { IComment } from "./comment.interface";

export interface IPostUpdate {
  postId: string;
  title: string;
  summary: string;
  content: string;
  authorId: string;
  file?: Express.Multer.File;
  tag: Array<Types.ObjectId | ITag>;
}

export interface IPost extends IPostUpdate, Document {}
