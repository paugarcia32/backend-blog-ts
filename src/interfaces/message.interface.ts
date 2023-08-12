import { Document } from "mongoose";

interface IMessage extends Document {
  author: string;
  email: string;
  message: string;
  date: Date;
}

export default IMessage;
