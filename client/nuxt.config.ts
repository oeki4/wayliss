// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
      ],
    },
  },
  devtools: { enabled: true },
  alias: {
    "@": "../src",
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@nuxt/image",
    "vue3-carousel-nuxt",
  ],
  css: ["./src/app/assets/css/reset.css", "./src/app/assets/css/main.css"],
  dir: {
    pages: "./src/app/routes",
    layouts: "./src/app/layouts",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    SSR_API_URL: process.env.SSR_API_URL,
    public: {
      API_URL: process.env.API_URL,
      STATIC_URL: process.env.STATIC_URL,
    },
  },
});
