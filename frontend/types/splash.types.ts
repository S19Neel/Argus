export type SplashPhase = "shimmer" | "translate" | "done";

export interface TransformTarget {
  x: number;
  y: number;
  scale: number;
}

export interface SplashScreenProps {
  onComplete: () => void;
  onTranslateStart?: () => void;
}
