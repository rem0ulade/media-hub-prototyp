/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STATIC_DEMO: string;
  readonly VITE_BRAND: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_AI_DEFAULT_MODEL: string;
  readonly VITE_AI_PROVIDER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
