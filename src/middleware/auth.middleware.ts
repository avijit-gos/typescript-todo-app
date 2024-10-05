/** @format */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import CustomRequest from "../interface/customrequest.interface";
import CreateError from "http-errors";

export async function authentication(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) throw CreateError.BadRequest("No token data found");
    const verify = await jwt.verify(token, process.env.SECRET as string);
    req.user = verify;
    if (req.user.status !== "active")
      throw CreateError.BadRequest("Account is not active");
    next();
  } catch (error) {
    next(error);
  }
}
