const assert = require("node:assert/strict");
const fs = require("node:fs");

const config = fs.readFileSync("auth-config.js", "utf8");
const auth = fs.readFileSync("auth.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");

for (const forbidden of ["GOOGLE_CLIENT_SECRET", "NAVER_CLIENT_SECRET", "AUTH_SESSION_SECRET", "clientSecret"]) {
  assert.ok(!config.includes(forbidden), `${forbidden} must not be present in client config`);
  assert.ok(!auth.includes(forbidden), `${forbidden} must not be present in client code`);
  assert.ok(!html.includes(forbidden), `${forbidden} must not be present in HTML`);
}

assert.match(config, /backendBaseUrl: ""/, "production auth must remain disabled until a backend is connected");
assert.match(auth, /\/auth\/\$\{provider\}\/start/, "provider start endpoint contract is missing");
assert.match(auth, /auth_status/, "callback status handling is missing");
assert.match(auth, /pending/, "manual approval pending state is missing");
assert.match(auth, /approved/, "manual approval success state is missing");
assert.match(auth, /rejected/, "manual approval rejection state is missing");

console.log("auth static checks: provider contract, manual approval states, and client secret guards passed");
