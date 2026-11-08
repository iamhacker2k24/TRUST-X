/**
 * Frontend Environment Configuration
 * Reads Vite environment variables safely with fallback defaults.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const APP_ENV =
  import.meta.env.VITE_APP_ENV || "development";

export const IS_PRODUCTION = import.meta.env.PROD;

export const IS_DEVELOPMENT = import.meta.env.DEV;

