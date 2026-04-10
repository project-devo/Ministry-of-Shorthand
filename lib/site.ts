import type { Metadata } from "next";

export const SITE_NAME = "Ministry of Shorthand";
export const SITE_URL = "https://ministryofshorthand.com";
export const DEFAULT_OG_IMAGE = "/og-image.svg";

export const buildMetadata = ({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  path = "/",
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
}): Metadata => {
  const absoluteUrl = new URL(path, SITE_URL).toString();
  const absoluteImage = image.startsWith("http") ? image : new URL(image, SITE_URL).toString();

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      images: [absoluteImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [absoluteImage],
    },
  };
};
