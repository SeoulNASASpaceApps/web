import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BulletinPost, CohortYear } from "@/domain/content";

const CATEGORIES = ["REGISTRATION", "TEAM", "EVENT", "SUBMISSION", "AWARDS", "NOTICE"] as const;

type BulletinCategory = (typeof CATEGORIES)[number];

function bulletinDirectory(year: CohortYear) {
  return path.join(process.cwd(), "content", "cohorts", String(year), "bulletin");
}

function requiredString(data: Record<string, unknown>, key: string, filename: string) {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${filename}: frontmatter '${key}' must be a non-empty string.`);
  }
  return value.trim();
}

function requiredBoolean(data: Record<string, unknown>, key: string, filename: string) {
  const value = data[key];
  if (typeof value !== "boolean") {
    throw new Error(`${filename}: frontmatter '${key}' must be true or false.`);
  }
  return value;
}

function dateString(data: Record<string, unknown>, key: string, filename: string) {
  const value = data[key];
  const normalized = value instanceof Date ? value.toISOString().slice(0, 10) : requiredString(data, key, filename);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error(`${filename}: frontmatter '${key}' must use YYYY-MM-DD.`);
  }
  return normalized;
}

type BulletinFiles = { base?: string; en?: string };

function parseBulletin(year: CohortYear, slug: string, filename: string, englishFilename?: string): BulletinPost {
  const source = fs.readFileSync(path.join(bulletinDirectory(year), filename), "utf8");
  const { data, content } = matter(source);
  const category = requiredString(data, "category", filename);

  if (!CATEGORIES.includes(category as BulletinCategory)) {
    throw new Error(`${filename}: unsupported category '${category}'.`);
  }
  if (!("thumbnail" in data) || (data.thumbnail !== null && typeof data.thumbnail !== "string")) {
    throw new Error(`${filename}: frontmatter 'thumbnail' must be a path string or null.`);
  }

  const isLegacy = !filename.endsWith(".ko.md");
  const koreanTitle = requiredString(data, isLegacy ? "titleKo" : "title", filename);
  let englishTitle = isLegacy ? requiredString(data, "titleEn", filename) : koreanTitle;
  let englishBody = content.trim();
  if (englishFilename) {
    const english = matter(fs.readFileSync(path.join(bulletinDirectory(year), englishFilename), "utf8"));
    englishTitle = requiredString(english.data, "title", englishFilename);
    englishBody = english.content.trim();
    if (!englishBody) {
      throw new Error(`${englishFilename}: body must be non-empty.`);
    }
  }

  return {
    id: `${year}-${slug}`,
    cohort: year,
    slug,
    title: {
      ko: koreanTitle,
      en: englishTitle,
    },
    summary: { ko: "", en: "" },
    publishedAt: dateString(data, "publishedAt", filename),
    updatedAt: dateString(data, "updatedAt", filename),
    category: category as BulletinCategory,
    pinned: requiredBoolean(data, "pinned", filename),
    published: requiredBoolean(data, "published", filename),
    thumbnail: typeof data.thumbnail === "string" && data.thumbnail.trim() ? data.thumbnail.trim() : null,
    body: { ko: content.trim(), en: englishBody },
    contentLocale: { ko: "ko", en: englishFilename || isLegacy ? "en" : "ko" },
  };
}

export function getAllBulletinDocuments(year: CohortYear) {
  const directory = bulletinDirectory(year);
  if (!fs.existsSync(directory)) return [];

  const groups = new Map<string, BulletinFiles>();
  for (const filename of fs.readdirSync(directory).filter((name) => name.endsWith(".md"))) {
    const stem = filename.slice(0, -3);
    const suffix = stem.includes(".") ? stem.slice(stem.lastIndexOf(".") + 1) : undefined;
    if (suffix !== undefined && suffix !== "ko" && suffix !== "en") {
      throw new Error(`${filename}: unsupported locale suffix '${suffix}'.`);
    }
    const slug = suffix === undefined ? stem : stem.slice(0, stem.lastIndexOf("."));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`${filename}: filename must be a lowercase kebab-case slug.`);
    }
    const files = groups.get(slug) ?? {};
    if (suffix === "en") {
      files.en = filename;
    } else {
      if (files.base) {
        throw new Error(`${filename}: duplicate base file; cannot have both '${files.base}' and '${filename}'.`);
      }
      files.base = filename;
    }
    groups.set(slug, files);
  }

  return Array.from(groups, ([slug, files]) => {
    if (!files.base) {
      throw new Error(`${files.en}: English file requires a .ko.md or .md base file.`);
    }
    return parseBulletin(year, slug, files.base, files.en);
  });
}

export function getPublishedBulletins(year: CohortYear) {
  return getAllBulletinDocuments(year)
    .filter((post) => post.published)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
}

export function getPublishedBulletin(year: CohortYear, slug: string) {
  return getPublishedBulletins(year).find((post) => post.slug === slug);
}
