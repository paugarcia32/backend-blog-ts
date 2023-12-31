import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";
import { ITag } from "./tag.interface";
import { IComment } from "./comment.interface";

export interface IPost extends Document {
  title: string;
  summary: string;
  content: string;
  cover: string;
  author: Types.ObjectId | IUser;
  tag: Array<Types.ObjectId | ITag>;
  comments: Array<Types.ObjectId | IComment>;
  file: Express.Multer.File | null;
  // file: File | Express.Multer.File | undefined | null;
  createdAt: Date;
  updatedAt: Date;
}
