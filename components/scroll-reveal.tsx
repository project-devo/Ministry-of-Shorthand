"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * ScrollReveal wraps elements to provide smooth scroll-based entrance reveals,
 * configured with the 'spring-gentle' preset from DESIGN_SPEC.md Section 2.1 & 2.2.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger reveal when element is 100px inside the viewport
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 1.0,
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
