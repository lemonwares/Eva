/**
 * Development-only logger utility.
 * Logs are suppressed in production to prevent data leaks and noise.
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  /** Debug info — only visible in development */
  debug(...args: unknown[]) {
    if (isDev) console.log("[DEBUG]", ...args);
  },

  /** Informational log — only visible in development */
  info(...args: unknown[]) {
    if (isDev) console.log("[INFO]", ...args);
  },

  /** Warnings — always visible */
  warn(...args: unknown[]) {
    console.warn("[WARN]", ...args);
  },

  /** Errors — always visible (also captured by Sentry) */
  error(...args: unknown[]) {
    console.error("[ERROR]", ...args);
  },
};
