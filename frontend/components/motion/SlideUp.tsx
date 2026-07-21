"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  prefersReducedMotion,
  slideUpVariants,
} from "@/constants/animation.constants";
import type { AnimationWrapperProps } from "@/types/motion.types";

export const SlideUp = memo(function SlideUp({
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
        hidden: slideUpVariants.hidden,
        visible: {
          ...((slideUpVariants.visible as object) || {}),
          transition: {
            duration: 0.6,
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
