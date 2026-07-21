"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  prefersReducedMotion,
  scaleInVariants,
} from "@/constants/animation.constants";
import type { AnimationWrapperProps } from "@/types/motion.types";

export const ScaleIn = memo(function ScaleIn({
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
        hidden: scaleInVariants.hidden,
        visible: {
          ...((scaleInVariants.visible as object) || {}),
          transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay,
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
