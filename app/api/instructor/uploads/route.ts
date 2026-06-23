import { errorResponse, successResponse } from "@/lib/api";
import { getCloudinary } from "@/lib/cloudinary";
import { requireInstructorApiSession } from "@/lib/instructor-session";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import {
  getUploadLimitMessage,
  isUploadResourceType,
  MAX_UPLOAD_BYTES,
} from "@/lib/uploads";

export const POST = async (request: Request) => {
  const { error, session } = await requireInstructorApiSession();

  if (error) {
    return error;
  }

  try {
    const rateLimitResponse = await checkRateLimit({
      key: getRateLimitKey(request, "instructor:uploads", session?.user.id),
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "ministry-of-shorthand/instructor");
    const resourceType = String(formData.get("resourceType") ?? "image");

    if (!(file instanceof File)) {
      return errorResponse("A file is required.", 400);
    }

    if (!isUploadResourceType(resourceType)) {
      return errorResponse("Unsupported upload type.", 400);
    }

    if (file.size > MAX_UPLOAD_BYTES[resourceType]) {
      return errorResponse(getUploadLimitMessage(resourceType), 413);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinary = getCloudinary();

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
            resource_type: resourceType,
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
