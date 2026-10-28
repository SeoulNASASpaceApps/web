const assert = require("node:assert/strict");
const { determineStatus } = require("../status.js");

const beforeEarly = new Date("2026-09-21T00:00:00.000Z");
const afterEarly = new Date("2026-10-01T00:00:00.000Z");

assert.equal(determineStatus({ nasa: "no", seoul: "no", local: "no", team: "none" }, beforeEarly).key, "official-needed");
assert.equal(determineStatus({ nasa: "yes", seoul: "no", local: "no", team: "none" }, beforeEarly).key, "seoul-needed");
assert.equal(determineStatus({ nasa: "yes", seoul: "yes", local: "no", team: "none" }, beforeEarly).key, "local-needed");
assert.equal(determineStatus({ nasa: "yes", seoul: "yes", local: "yes", team: "confirmed" }, beforeEarly).key, "ready");
assert.equal(determineStatus({ nasa: "yes", seoul: "yes", local: "yes", team: "matching" }, beforeEarly).key, "team-needed");
assert.equal(determineStatus({ nasa: "yes", seoul: "yes", local: "yes", team: "none" }, afterEarly).key, "waitlist-check");

for (const input of [
  { nasa: "no", seoul: "yes", local: "yes", team: "confirmed" },
  { nasa: "yes", seoul: "no", local: "yes", team: "confirmed" },
  { nasa: "yes", seoul: "yes", local: "no", team: "confirmed" }
]) {
  assert.equal(determineStatus(input, beforeEarly).whitelistEligible, false, "all of steps 1, 2, and 3 are required");
}

for (const team of ["confirmed", "matching", "none"]) {
  assert.equal(determineStatus({ nasa: "yes", seoul: "yes", local: "yes", team }, beforeEarly).whitelistEligible, true, "step 4 must not change whitelist eligibility");
}

console.log("status logic: six routes plus 1·2·3 whitelist gate passed");
