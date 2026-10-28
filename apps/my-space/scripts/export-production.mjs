import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createReviewDocument, reviewAssetFiles } from "./review-document.mjs";
import { createAuthConfig } from "./service-config.mjs";

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
  "live-directory.js",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of productionFiles) {
  if (file !== "auth-config.js") {
    await cp(new URL(`../${file}`, import.meta.url), new URL(file, outputDirectory));
  }
}
const authConfig = createAuthConfig(process.env.MY_SPACE_API_BASE_URL || "");
await writeFile(new URL("auth-config.js", outputDirectory), authConfig);

const includeReview = process.env.VERCEL_ENV === "preview" || process.env.MY_SPACE_REVIEW === "1";
if (includeReview) {
  const reviewDirectory = new URL("review/", outputDirectory);
  await mkdir(reviewDirectory, { recursive: true });
  for (const file of [...productionFiles.filter((file) => !["index.html", "auth-config.js"].includes(file)), ...reviewAssetFiles]) {
    await cp(new URL(`../${file}`, import.meta.url), new URL(file, reviewDirectory));
  }
  await writeFile(new URL("auth-config.js", reviewDirectory), authConfig);
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  await writeFile(new URL("index.html", reviewDirectory), createReviewDocument(html));
}

console.log(`exported MY SPACE assets to frontend/public/my-space/${includeReview ? " with Preview review tools" : " without review tools"}`);
