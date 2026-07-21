import React from "react";
import type { HTMLMotionProps } from "framer-motion";

export interface AnimationWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export type StaggerItemProps = Omit<AnimationWrapperProps, "delay">;
