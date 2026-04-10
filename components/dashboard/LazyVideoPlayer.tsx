"use client";

import dynamic from "next/dynamic";

const VideoPlayer = dynamic(
  () => import("@/components/dashboard/VideoPlayer").then((module) => module.VideoPlayer),
  {
    ssr: false,
    loading: () => <div className="aspect-video animate-pulse rounded-[1.25rem] bg-secondary" />,
  },
);

export const LazyVideoPlayer = ({ source }: { source: string }) => {
  return <VideoPlayer source={source} />;
};
