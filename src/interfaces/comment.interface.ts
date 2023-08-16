import { Document } from "mongoose";
import { IPost } from "./post.interface";

export interface IComment extends Document {
  autor: string;
  fecha_comentario: Date;
  contenido: string;
  likes: number;
  postId: IPost["_id"];
}
