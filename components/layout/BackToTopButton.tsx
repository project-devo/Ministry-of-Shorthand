"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 480);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/95 px-4 py-3 text-sm font-medium text-foreground shadow-xl shadow-black/10 transition-colors hover:bg-secondary"
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" />
      Top
    </button>
  );
};
