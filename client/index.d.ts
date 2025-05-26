declare module "nuxt/schema" {
  interface RuntimeConfig {
    SSR_API_URL: string;
  }
  interface PublicRuntimeConfig {
    API_URL: string;
    STATIC_URL: string;
  }
}

export {};
