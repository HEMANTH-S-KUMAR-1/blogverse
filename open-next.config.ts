import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  buildCommand: "echo 'Skipping Next.js build - using pre-built .next'",
});