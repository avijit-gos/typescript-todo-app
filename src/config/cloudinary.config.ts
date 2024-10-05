/** @format */

import { v2 as cloudinary } from "cloudinary";

async function cloudinaryInit() {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.API_KEY as string,
    api_secret: process.env.API_SECRET_KEY as string,
  });
}

export default cloudinaryInit;
