/** @format */

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import CreateError from "http-errors";
import IUser from "../interface/user.interface";
import userModel from "../model/user.model";
import encryptPassword from "../utils/encypt.password";
import generateToken from "../utils/generate.token";
import decryptPassword from "../utils/decrypt.password";
import CustomRequest from "../interface/customrequest.interface";
import uploadImage from "../utils/upload.image";

//*** Register new User ***//
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !name.trim())
      throw CreateError.BadRequest("Please provide user name");
    if (!email || !email.trim())
      throw CreateError.BadRequest("Please provide user email");
    if (!username || !username.trim())
      throw CreateError.BadRequest("Please provide username");
    if (!password || !password.trim())
      throw CreateError.BadRequest("Please provide password");

    const isUserExists: IUser | null = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (isUserExists)
      throw CreateError.BadRequest(
        "User with same email or username already exists"
      );
    //*** Encrypt user password ***//
    const hash = await encryptPassword(password);

    //*** Save new user in DB ***//
    const newUser = new userModel({
      _id: new mongoose.Types.ObjectId(),
      name,
      username,
      email,
      password: hash,
    });
    const user: IUser | null = await newUser.save();

    //*** Generate token for authentication ***//
    const token: string = await generateToken(user);
    res
      .status(201)
      .json({ message: "User register successfull", status: 201, user, token });
  } catch (error) {
    next(error);
  }
};

//*** Login user ***//
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userInfo, password } = req.body;
    if (!userInfo || !userInfo.trim())
      throw CreateError.BadRequest("Please provide user email or username");
    if (!password || !password.trim())
      throw CreateError.BadRequest("Please provide user password");

    //*** Check user is exists in DB ***//
    const user = await userModel.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });
    if (!user) throw CreateError.BadRequest("No user found");
    if (user && user.status !== "active")
      throw CreateError.BadRequest("User account is not active");

    //*** Compare password ***//
    const result: boolean = await decryptPassword(password, user.password);
    if (!result) throw CreateError.BadRequest("Password is not correct");

    //*** Generate token ***//
    const token: string = await generateToken(user);
    res.status(200).json({
      message: "User successfully loggedIn",
      status: 200,
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

//*** Fetch user profile ***//
export const getProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: IUser | null = await userModel
      .findById(req.user._id)
      .select("-password");
    if (!user) throw CreateError.BadRequest("No user found");
    if (user && user.status !== "active")
      throw CreateError.BadRequest("User profile is not active");
    res
      .status(200)
      .json({ message: "Fetching profile details", status: 200, user });
  } catch (error) {
    next(error);
  }
};

//*** Update profile details ***//
export const updateProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    var imageURL: string | undefined = "";
    const originalUserData = await userModel
      .findById(req.user._id)
      .select("-password");
    if (!originalUserData) throw CreateError.BadRequest("No user data found");
    if (originalUserData && originalUserData.status !== "active")
      throw CreateError.BadRequest("User account is not active");

    if (req.files?.image) {
      const result = await uploadImage(req.files?.image);
      imageURL = result.url;
    }
    const updateProfiledata: IUser | null = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name: req.body.name || originalUserData.name,
          profileImage: imageURL || originalUserData.profileImage,
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Profile has been updated",
      status: 200,
      user: updateProfiledata,
    });
  } catch (error) {
    next(error);
  }
};

//*** Update profile password ***//
export const updateProfilePassword = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password, confirmPassword, newPassword } = req.body;
    if (!password) throw CreateError.BadRequest("Please provide old password");
    if (!newPassword)
      throw CreateError.BadRequest("Please provide the new password");
    if (!confirmPassword)
      throw CreateError.BadRequest("Please confirm new password");
    if (confirmPassword !== newPassword)
      throw CreateError.BadRequest(
        "New password & confirm password did not match"
      );
    const user = await userModel
      .findById(req.user._id)
      .select("password status");
    if (!user) throw CreateError.BadRequest("No user data found");
    if (user && user.status !== "active")
      throw CreateError.BadRequest("User account is not active");

    const result = await decryptPassword(password, user.password);
    if (!result) throw CreateError.BadRequest("Password is not correct");
    const hash = await encryptPassword(newPassword);
    const updateProfilePassword = await userModel.findByIdAndUpdate(
      req.user._id,
      { $set: { password: hash } },
      { new: true }
    );
    res.status(200).json({
      message: "Profile password has been changed",
      status: 200,
      user: updateProfilePassword,
    });
  } catch (error) {
    next(error);
  }
};

//*** Delete profile ***//
export const deleteUserAccount = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("password status");
    if (!user) throw CreateError.BadRequest("No user data found");
    if (user && user.status !== "active")
      throw CreateError.BadRequest("User account is not active");

    const deletedUserData = await userModel.findByIdAndUpdate(
      req.user._id,
      { $set: { status: "delete" } },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Profile has been deleted",
        status: 200,
        user: deletedUserData,
      });
  } catch (error) {
    next(error);
  }
};
