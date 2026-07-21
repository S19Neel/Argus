export const SPLASH_LETTERS = ["A", "R", "G", "U", "S"];
export const SPLASH_SESSION_KEY = "argus_splash_played";

/* Duration constants (seconds) */
export const LETTER_STAGGER_SEC = 0.12;
export const SHIMMER_DURATION_SEC = 0.7;
export const HOLD_AFTER_SHIMMER_SEC = 0.6;
export const TRANSLATE_DURATION_SEC = 0.8;
export const TOTAL_SHIMMER_SEC =
  SPLASH_LETTERS.length * LETTER_STAGGER_SEC + SHIMMER_DURATION_SEC;
export const TOTAL_SPLASH_MS =
  (TOTAL_SHIMMER_SEC + HOLD_AFTER_SHIMMER_SEC + TRANSLATE_DURATION_SEC) * 1000;
