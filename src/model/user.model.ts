/** @format */

import mongoose from "mongoose";
import IUser from "../interface/user.interface";

const UserSchema = new mongoose.Schema<IUser>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: {
      type: String,
      trim: true,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "User email is required"],
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted'], default: 'active'
    },
    accountType: {
      type: String,
      enum: ['user', 'admin'], default: 'user'
    },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Users", UserSchema);
