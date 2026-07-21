"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/constants/animation.constants";
import type { AnimationWrapperProps } from "@/types/motion.types";

export const StaggerContainer = memo(function StaggerContainer({
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
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
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
