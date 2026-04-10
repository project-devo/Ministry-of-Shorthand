"use client";

import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";

export const VideoPlayer = ({ source }: { source: string }) => {
  return (
    <Plyr
      source={{
        type: "video",
        sources: [
          {
            src: source,
          },
        ],
      }}
      options={{
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
      }}
    />
  );
};
