const path = require("path");
const dotenv = require("dotenv");

const env =
  process.env.APP_ENV ||
  (process.env.NODE_ENV === "production" ? "production" : "development");
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`),
  override: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Keep staging & production builds side-by-side (useful when both run on one server via PM2)
  distDir: `.next-${env}`,
  // output: "export",
  // images: {
  //   unoptimized: true,
  // },
};

module.exports = nextConfig;
