const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "HTML ids must be unique");

for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.includes(anchor), `missing anchor target: #${anchor}`);
}

for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  assert.match(tag, /rel="[^"]*noreferrer[^"]*"/, "external links need rel=noreferrer");
}

for (const file of ["styles.css", "status.js", "auth-config.js", "auth.js", "contact-config.js", "match.js", "app.js"]) {
  assert.ok(fs.existsSync(file), `missing required file: ${file}`);
}

assert.ok(!fs.existsSync(".openai/hosting.json"), "Sites hosting identity must not be copied into the official repository");

for (const phrase of ["Waitlist면", "운영팀이 확인한 참가 기록", "프로젝트 참가"]) {
  assert.ok(html.includes(phrase), `missing required content: ${phrase}`);
}

for (const removedPhrase of ["NASA 공식 등록, 서울 참가 확인", "HACKATHON", "NASA 공식 규정이 가장 먼저입니다"]) {
  assert.ok(!html.includes(removedPhrase), `redundant hero content must be removed: ${removedPhrase}`);
}

assert.ok(!html.includes("운영진용 정책 기준"), "internal policy panel must not appear in the participant page");
assert.ok(!html.includes("Whitelist 승인 조건"), "internal whitelist criteria must not appear in the participant page");

assert.match(css, /@media \(max-width: 560px\)/, "mobile breakpoint missing");
assert.match(css, /prefers-reduced-motion/, "reduced motion support missing");
console.log("static checks: structure, links, content, and mobile guards passed");
