// import { Document } from "mongoose";

// export interface IComment extends Document {
//   autor: string;
//   fecha_comentario: Date;
//   contenido: string;
//   likes: number;
// }

import { Document } from "mongoose";
import { IPost } from "./post.interface";

export interface IComment extends Document {
  autor: string;
  fecha_comentario: Date;
  contenido: string;
  likes: number;
  postId: IPost["_id"]; // Agregar esta línea para la referencia al ID del post
}
