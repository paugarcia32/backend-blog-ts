import mongoose, { Schema, Document, Model } from "mongoose";

import { IUser } from "../interfaces/user.interface";

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
