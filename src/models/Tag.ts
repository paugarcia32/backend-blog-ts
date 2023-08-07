import mongoose, { Schema, Document, Model } from "mongoose";
import { ITag } from "../interfaces/tag.interface";

const TagSchema: Schema<ITag> = new Schema({
  title: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const TagModel: Model<ITag> = mongoose.model<ITag>("Tag", TagSchema);

export default TagModel;
