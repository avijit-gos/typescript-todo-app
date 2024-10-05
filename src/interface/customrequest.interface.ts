/** @format */
import { Request } from "express";
// import { UploadedFile } from "express-fileupload";
interface CustomRequest extends Request {
  user?: any;
  // files?: {
  //   image?: UploadedFile;
  // };
}

export default CustomRequest;
