"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  prefersReducedMotion,
  slideUpVariants,
} from "@/constants/animation.constants";
import type { StaggerItemProps } from "@/types/motion.types";

export const StaggerItem = memo(function StaggerItem({
  children,
  className,
  ...rest
}: StaggerItemProps) {
  if (prefersReducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div variants={slideUpVariants} className={className} {...rest}>
      {children}
    </motion.div>
  );
});
