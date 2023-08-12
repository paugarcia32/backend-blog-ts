import mongoose, { Schema, Model } from "mongoose";
import IMessage from "../interfaces/message.interface";

const messageSchema = new Schema<IMessage>(
  {
    author: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model("Message", messageSchema);

export default Message;
