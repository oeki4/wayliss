// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
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
    public: {
      API_URL: process.env.API_URL,
      STATIC_URL: process.env.STATIC_URL,
    },
  },
});
