import type { Socket } from "socket.io-client";

declare module "nuxt/schema" {
  interface RuntimeConfig {
    SSR_API_URL: string;
  }
  interface PublicRuntimeConfig {
    API_URL: string;
    STATIC_URL: string;
    SOCKET_URL: string;
  }
}

declare module "#app" {
  interface NuxtApp {
    $socket: Socket;
  }
}

export {};
