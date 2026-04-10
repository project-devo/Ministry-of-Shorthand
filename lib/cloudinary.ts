import { v2 as cloudinary } from "cloudinary";

let configured = false;

export const getCloudinary = () => {
  if (!configured) {
    if (!process.env.CLOUDINARY_URL) {
      throw new Error("CLOUDINARY_URL is not configured.");
    }

    cloudinary.config(process.env.CLOUDINARY_URL);

    configured = true;
  }

  return cloudinary;
};
