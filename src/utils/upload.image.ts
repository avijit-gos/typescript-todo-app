/** @format */

import { v2 as cloudinary } from 'cloudinary';
import cloudinaryInit from '../config/cloudinary.config';

async function uploadImage(image: any) {
  cloudinaryInit();
  const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
    folder: 'ToDo_App',
  });
  return uploadResult;
}

export default uploadImage;
