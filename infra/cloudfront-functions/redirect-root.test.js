const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(
  require.resolve("./redirect-root.js"),
  "utf8",
);
const handler = vm.runInNewContext(`${source}\nhandler;`);

const redirect = handler({ request: { uri: "/" } });
assert.equal(redirect.statusCode, 302);
assert.equal(redirect.headers.location.value, "/2026/ko/");
assert.equal(redirect.headers["cache-control"].value, "max-age=0, must-revalidate");

const request = { uri: "/2025/" };
assert.equal(handler({ request }), request);

const currentCohortRequest = { uri: "/2026/ko/" };
assert.equal(handler({ request: currentCohortRequest }), currentCohortRequest);
