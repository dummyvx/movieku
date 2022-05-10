/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },
  images: {
    domains: ["107.152.39.187", "image.tmdb.org"],
  },
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
    localeDetection: true,
  },
  experimental: {
    nextScriptWorkers: true,
  },
};
