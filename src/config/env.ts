// src/config/env.ts

const getEnvString = (key: string, defaultValue: string): string => {
  return import.meta.env[key] || defaultValue;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const config = {
  // API
  api: {
    baseUrl: getEnvString('VITE_API_BASE_URL', 'https://randomuser.me/api'),
    timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  },

  // App
  app: {
    name: getEnvString('VITE_APP_NAME', 'User Management Dashboard'),
    version: getEnvString('VITE_APP_VERSION', '1.0.0'),
  },

  // Cache
  cache: {
    enabled: getEnvBoolean('VITE_ENABLE_CACHE', true),
    staleTime: getEnvNumber('VITE_CACHE_STALE_TIME', 300000),
    gcTime: getEnvNumber('VITE_CACHE_GC_TIME', 600000),
  },

  // Pagination
  pagination: {
    defaultPageSize: getEnvNumber('VITE_DEFAULT_PAGE_SIZE', 15),
    maxResults: getEnvNumber('VITE_MAX_RESULTS', 1000),
  },

  // Features
  features: {
    dragDrop: getEnvBoolean('VITE_ENABLE_DRAG_DROP', true),
    export: getEnvBoolean('VITE_ENABLE_EXPORT', true),
    selection: getEnvBoolean('VITE_ENABLE_SELECTION', true),
  },

  // Built-in Vite env
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

export type Config = typeof config;
export default config;