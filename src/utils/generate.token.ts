/** @format */

import jwt from "jsonwebtoken";
import IUser from "../interface/user.interface";

async function generateToken(user: IUser): Promise<string> {
  const token: string = await jwt.sign(
    { _id: user._id, status: user.status, accountType: user.accountType },
    process.env.SECRET as string,
    { expiresIn: "10d" }
  );
  return token;
}
export default generateToken;
