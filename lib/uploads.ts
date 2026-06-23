export const MAX_UPLOAD_BYTES = {
  image: 5 * 1024 * 1024,
  raw: 15 * 1024 * 1024,
  video: 100 * 1024 * 1024,
} as const;

export type UploadResourceType = keyof typeof MAX_UPLOAD_BYTES;

export const isUploadResourceType = (value: string): value is UploadResourceType => {
  return value === "image" || value === "video" || value === "raw";
};

export const getUploadLimitMessage = (resourceType: UploadResourceType) => {
  const sizeInMb = MAX_UPLOAD_BYTES[resourceType] / (1024 * 1024);
  return `${resourceType} uploads must be ${sizeInMb}MB or smaller.`;
};
