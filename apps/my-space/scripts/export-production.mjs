import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createReviewDocument, reviewAssetFiles } from "./review-document.mjs";

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

const includeReview = process.env.VERCEL_ENV === "preview" || process.env.MY_SPACE_REVIEW === "1";
if (includeReview) {
  const reviewDirectory = new URL("review/", outputDirectory);
  await mkdir(reviewDirectory, { recursive: true });
  for (const file of [...productionFiles.filter((file) => file !== "index.html"), ...reviewAssetFiles]) {
    await cp(new URL(`../${file}`, import.meta.url), new URL(file, reviewDirectory));
  }
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  await writeFile(new URL("index.html", reviewDirectory), createReviewDocument(html));
}

console.log(`exported MY SPACE assets to frontend/public/my-space/${includeReview ? " with Preview review tools" : " without review tools"}`);
