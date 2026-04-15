/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Milliseconds between silent campaign refetches (default 8000). Min 3000. */
  readonly VITE_CAMPAIGN_POLL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
