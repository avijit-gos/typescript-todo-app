/** @format */

import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  updateProfilePassword,
  deleteUserAccount,
} from "../controller/user.controller";
import { authentication } from "../middleware/auth.middleware";
const router = express();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authentication, getProfile);
router.put("/update-profile", authentication, updateProfile);
router.patch("/update-profile-password", authentication, updateProfilePassword);
router.delete("/delete-profile", authentication, deleteUserAccount);

export default router;
