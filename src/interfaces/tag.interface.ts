import { Document } from "mongoose";
import { IPost } from "./post.interface";

export interface ITag extends Document {
  title: string;
  posts: IPost["_id"][];
}
