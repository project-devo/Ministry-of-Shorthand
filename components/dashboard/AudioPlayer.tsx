"use client";

import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";

export const AudioPlayer = ({ source }: { source: string }) => {
  return (
    <Plyr
      source={{
        type: "audio",
        sources: [
          {
            src: source,
          },
        ],
      }}
      options={{
        controls: ["play", "progress", "current-time", "mute", "volume", "settings"],
        settings: ["speed"],
        speed: {
          selected: 1,
          options: [0.75, 1, 1.25, 1.5],
        },
      }}
    />
  );
};
