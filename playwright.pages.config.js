import { defineConfig } from "@playwright/test";
import base from "./playwright.config.js";
export default defineConfig({
  ...base,
  testMatch: "pages.spec.js",
  use: { ...base.use, baseURL: "http://127.0.0.1:4174/english-quest/" },
  webServer: {
    command: "npm run preview -- --base=/english-quest/ --port 4174",
    url: "http://127.0.0.1:4174/english-quest/",
    reuseExistingServer: false,
  },
});
