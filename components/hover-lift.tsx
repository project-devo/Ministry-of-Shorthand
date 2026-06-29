"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * HoverLift wraps card components to provide smooth physicist-based spring hover lifts
 * and subtle shadow/border transformations, matching DESIGN_SPEC.md Section 2.3.
 */
export function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1.0 }}
      className={cn(
        "h-full rounded-[var(--radius)] transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
