import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";
import { ITag } from "./tag.interface";
import { IComment } from "./comment.interface";

export interface IPostCreation {
  title: string;
  summary: string;
  content: string;
  cover: string;
  author: Types.ObjectId | IUser;
  tag: Array<Types.ObjectId | ITag>;
  comments: Array<Types.ObjectId | IComment>;
  file: Express.Multer.File;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends IPostCreation, Document {}
