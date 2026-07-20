"use client";

import React, { memo } from "react";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Shared reduced-motion check                                       */
/* ------------------------------------------------------------------ */

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const skip = prefersReducedMotion;

/* ------------------------------------------------------------------ */
/*  Variant presets                                                    */
/* ------------------------------------------------------------------ */

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Wrapper components                                                 */
/* ------------------------------------------------------------------ */

interface AnimationWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeIn = memo(function FadeIn({
  children,
  className,
  delay = 0,
  ...rest
}: AnimationWrapperProps) {
  if (skip) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
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

export const SlideUp = memo(function SlideUp({
  children,
  className,
  delay = 0,
  ...rest
}: AnimationWrapperProps) {
  if (skip) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
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

export const ScaleIn = memo(function ScaleIn({
  children,
  className,
  delay = 0,
  ...rest
}: AnimationWrapperProps) {
  if (skip) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0, scale: 0.92 },
        visible: {
          opacity: 1,
          scale: 1,
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

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className,
  delay = 0,
  ...rest
}: AnimationWrapperProps) {
  if (skip) return <div className={className}>{children}</div>;
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

export const StaggerItem = memo(function StaggerItem({
  children,
  className,
  ...rest
}: Omit<AnimationWrapperProps, "delay">) {
  if (skip) return <div className={className}>{children}</div>;
  return (
    <motion.div
      variants={slideUpVariants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
