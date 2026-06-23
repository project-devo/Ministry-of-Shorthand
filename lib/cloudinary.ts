import { v2 as cloudinary } from "cloudinary";
import { getOptionalEnv, requireEnv } from "@/lib/env";

let configured = false;

export const getCloudinary = () => {
  if (!configured) {
    const cloudinaryUrl = getOptionalEnv("CLOUDINARY_URL");

    if (cloudinaryUrl) {
      cloudinary.config(cloudinaryUrl);
    } else {
      cloudinary.config({
        cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
        api_key: requireEnv("CLOUDINARY_API_KEY"),
        api_secret: requireEnv("CLOUDINARY_API_SECRET"),
        secure: true,
      });
    }

    configured = true;
  }

  return cloudinary;
};
