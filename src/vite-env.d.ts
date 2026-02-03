// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // App
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;

  // Cache
  readonly VITE_ENABLE_CACHE: string;
  readonly VITE_CACHE_STALE_TIME: string;
  readonly VITE_CACHE_GC_TIME: string;

  // Pagination
  readonly VITE_DEFAULT_PAGE_SIZE: string;
  readonly VITE_MAX_RESULTS: string;

  // Features
  readonly VITE_ENABLE_DRAG_DROP: string;
  readonly VITE_ENABLE_EXPORT: string;
  readonly VITE_ENABLE_SELECTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}