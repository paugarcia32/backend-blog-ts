import { Document } from "mongoose";

export interface IComment extends Document {
  autor: string;
  fecha_comentario: Date;
  contenido: string;
  likes: number;
}
