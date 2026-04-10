import { errorResponse, successResponse } from "@/lib/api";
import { getCloudinary } from "@/lib/cloudinary";
import { getServerAuthSession } from "@/lib/session";

export const POST = async (request: Request) => {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized.", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return errorResponse("Image file is required.", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinary = getCloudinary();

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ministry-of-shorthand/profile-photos",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Unable to upload image."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
          });
        },
      );

      stream.end(buffer);
    });

    return successResponse({
      imageUrl: uploadResult.secure_url,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to upload image.";
    return errorResponse(message, 500);
  }
};
