import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

const routes = [
  "index.html",
  "my-space/index.html",
  "2025/index.html",
  "2025/ko/index/index.html",
  "2025/en/index/index.html",
  "2025/ko/judges/index.html",
  "2025/en/judges/index.html",
  "2025/ko/sponsors/index.html",
  "2025/en/sponsors/index.html",
  "2025/ko/awardees/index.html",
  "2025/en/awardees/index.html",
  "2025/ko/crew/index.html",
  "2025/en/crew/index.html",
  "2025/ko/chatbot/index.html",
  "2025/en/chatbot/index.html",
  "2025/ko/contact/index.html",
  "2025/en/contact/index.html",
  "2025/ko/index.html",
  "2025/en/index.html",
  "2026/index.html",
];

for (const locale of ["ko", "en"]) {
  routes.push(`2026/${locale}/index.html`);
  for (const page of ["bulletin", "hall-of-fame", "projects", "judges", "partners", "team", "mentors"]) {
    routes.push(`2026/${locale}/${page}/index.html`);
  }
}

for (const route of routes) {
  assert.ok(fs.existsSync(path.join("out", route)), `Missing static route: ${route}`);
}

const reviewFiles = ["preview.js", "review-store.js", "review.html"];
const expectsReview = process.env.VERCEL_ENV === "preview" || process.env.MY_SPACE_REVIEW === "1";
for (const filename of reviewFiles) {
  assert.equal(
    fs.existsSync(path.join("out", "my-space", filename)),
    expectsReview,
    expectsReview
      ? `Preview review asset is missing: ${filename}`
      : `Review-only MY SPACE asset must not be exported: ${filename}`,
  );
}
if (expectsReview) {
  const reviewHtml = fs.readFileSync(path.join("out", "my-space", "review.html"), "utf8");
  assert.match(reviewHtml, /name="robots" content="noindex, nofollow"/, "Review page must opt out of indexing");
  assert.match(reviewHtml, /preview\.js/, "Review page must load the role selector");
  assert.match(reviewHtml, /review-store\.js/, "Review page must load fixture storage");
  const reviewCss = fs.readFileSync(path.join("out", "my-space", "styles.css"), "utf8");
  assert.match(reviewCss, /\.preview-toolbar \{ position: sticky;/, "Review toolbar must remain visible at direct state URLs");
}

const bulletinDirectory = path.join("content", "cohorts", "2026", "bulletin");
const bulletinFiles = new Map();
for (const filename of fs.readdirSync(bulletinDirectory).filter((name) => name.endsWith(".md"))) {
  const stem = filename.slice(0, -3);
  const suffix = stem.includes(".") ? stem.slice(stem.lastIndexOf(".") + 1) : undefined;
  if (suffix !== undefined && suffix !== "ko" && suffix !== "en") {
    throw new Error(`${filename}: unsupported locale suffix '${suffix}'.`);
  }
  const slug = suffix === undefined ? stem : stem.slice(0, stem.lastIndexOf("."));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${filename}: filename must be a lowercase kebab-case slug.`);
  }
  const files = bulletinFiles.get(slug) ?? {};
  if (suffix === "en") {
    files.en = filename;
  } else {
    if (files.base) {
      throw new Error(`${filename}: duplicate base file; cannot have both '${files.base}' and '${filename}'.`);
    }
    files.base = filename;
  }
  bulletinFiles.set(slug, files);
}

for (const [slug, files] of bulletinFiles) {
  if (!files.base) {
    throw new Error(`${files.en}: English file requires a .ko.md or .md base file.`);
  }
  const filename = files.base;
  const { data } = matter(fs.readFileSync(path.join(bulletinDirectory, filename), "utf8"));
  for (const locale of ["ko", "en"]) {
    const output = path.join("out", "2026", locale, "bulletin", slug, "index.html");
    for (const suffix of ["ko", "en"]) {
      const duplicate = path.join("out", "2026", locale, "bulletin", `${slug}.${suffix}`);
      assert.ok(!fs.existsSync(duplicate), `Locale file must not create a duplicate bulletin route: ${duplicate}`);
    }
    if (data.published === true) {
      assert.ok(fs.existsSync(output), `Missing published bulletin route: ${output}`);
    } else {
      assert.ok(!fs.existsSync(output), `Unpublished bulletin must not be exported: ${output}`);
    }
  }
}

const rootHtml = fs.readFileSync(path.join("out", "index.html"), "utf8");
assert.match(rootHtml, /url=\/2026\/ko\//, "Root fallback must target /2026/ko/");

process.stdout.write(
  `Verified ${routes.length} static routes, Markdown bulletins, and the /2026/ko/ root fallback.\n`,
);
