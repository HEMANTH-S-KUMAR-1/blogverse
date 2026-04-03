import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  buildCommand: "npm run build",
  esbuild: {
    external: ["node:sqlite"],
  },
});