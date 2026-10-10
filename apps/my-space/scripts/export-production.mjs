import { cp, mkdir, rm } from "node:fs/promises";

const outputDirectory = new URL("../../../frontend/public/my-space/", import.meta.url);
const productionFiles = [
  "index.html",
  "styles.css",
  "hub-policy.js",
  "match-catalog.js",
  "auth-config.js",
  "auth.js",
  "approval-flow.js",
  "contact-config.js",
  "seeking-teams.js",
  "match.js",
  "app.js",
  "workspace-ui.js",
  "interest-threads.js",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of productionFiles) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(file, outputDirectory));
}

console.log("exported MY SPACE production assets to frontend/public/my-space/");
