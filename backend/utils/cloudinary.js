import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from 'fs'
dotenv.config();
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API || 887572336826273,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadImageOnCloudinary = async (file) => {
  try {
    if (!file) throw new Error("No file provided for upload.");

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
  
    fs.unlink(file, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully from local storage:", file);
      }
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    return null;
  }
};

export const deleteImageOnCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error("No public ID provided for deletion.");

    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error.message);
    return null;
  }
};
