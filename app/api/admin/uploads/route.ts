import { errorResponse, successResponse } from "@/lib/api";
import { requireAdminApiSession } from "@/lib/admin-session";
import { getCloudinary } from "@/lib/cloudinary";

const allowedResourceTypes = new Set(["image", "video", "raw"]);

export const POST = async (request: Request) => {
  const { error } = await requireAdminApiSession();

  if (error) {
    return error;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "ministry-of-shorthand/admin");
    const resourceType = String(formData.get("resourceType") ?? "image");

    if (!(file instanceof File)) {
      return errorResponse("A file is required.", 400);
    }

    if (!allowedResourceTypes.has(resourceType)) {
      return errorResponse("Unsupported upload type.", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinary = getCloudinary();

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType as "image" | "video" | "raw",
        },
        (uploadError, result) => {
          if (uploadError || !result?.secure_url) {
            reject(uploadError ?? new Error("Unable to upload asset."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
          });
        },
      );

      stream.end(buffer);
    });

    return successResponse(
      {
        url: uploadResult.secure_url,
      },
      201,
    );
  } catch (errorValue: unknown) {
    const message = errorValue instanceof Error ? errorValue.message : "Unable to upload asset.";
    return errorResponse(message, 500);
  }
};
