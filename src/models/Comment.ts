import mongoose, { Schema, Document, Model } from "mongoose";
import { IComment } from "../interfaces/comment.interface";

const CommentSchema: Schema<IComment> = new Schema({
  autor: String,
  fecha_comentario: Date,
  contenido: String,
  likes: Number,
});

const CommentModel: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  CommentSchema
);

export default CommentModel;
