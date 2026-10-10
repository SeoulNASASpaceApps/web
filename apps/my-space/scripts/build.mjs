import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { createReviewDocument, reviewAssetFiles } from "./review-document.mjs";

const outputDirectory = new URL("../dist/", import.meta.url);
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of ["index.html", "styles.css", "hub-policy.js", "match-catalog.js", "auth-config.js", "auth.js", "approval-flow.js", "contact-config.js", "seeking-teams.js", "match.js", "app.js", "workspace-ui.js", "interest-threads.js", ...reviewAssetFiles]) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(`../dist/${file}`, import.meta.url));
}

console.log("built static site in dist/");

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
await writeFile(new URL("../dist/review.html", import.meta.url), createReviewDocument(html));
