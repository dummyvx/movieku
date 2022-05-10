/** @type {import('next-sitemap').IConfig} */

const BASE_URL = process.env.NEXT_PBULIC_BASE_URL;

module.exports = {
  siteUrl: BASE_URL ?? "http://localhost:3000",
  generateRobotsTxt: true,
};
