"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  prefersReducedMotion,
  fadeInVariants,
} from "@/constants/animation.constants";
import type { AnimationWrapperProps } from "@/types/motion.types";

export const FadeIn = memo(function FadeIn({
  children,
  className,
  delay = 0,
  ...rest
}: AnimationWrapperProps) {
  if (prefersReducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: fadeInVariants.hidden,
        visible: {
          ...((fadeInVariants.visible as object) || {}),
          transition: { duration: 0.6, ease: "easeOut", delay },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
