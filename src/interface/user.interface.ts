/** @format */

import mongoose from "mongoose";
interface IUser {
  readonly _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  username: string;
  password: string;
  profileImage: string;
  status: string;
  accountType: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export default IUser;
