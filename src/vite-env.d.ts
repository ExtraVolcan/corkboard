/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Milliseconds between silent campaign refetches (default 3500). Min 2000. */
  readonly VITE_CAMPAIGN_POLL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
