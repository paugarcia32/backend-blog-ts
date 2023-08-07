import mongoose, { Schema, Document, Model } from "mongoose";
import { IPost } from "../interfaces/post.interface";

const PostSchema: Schema<IPost> = new Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    tag: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const PostModel: Model<IPost> = mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
