import assert from "node:assert/strict";
import test from "node:test";
import { createAuthConfig } from "../scripts/service-config.mjs";

test("API config stays disabled without an explicit public service origin", () => {
  assert.match(createAuthConfig(""), /"backendBaseUrl": ""/);
});

test("API config accepts only a safe origin", () => {
  assert.match(createAuthConfig("https://my-space-api.example.org/"), /https:\/\/my-space-api\.example\.org/);
  assert.match(createAuthConfig("http://127.0.0.1:8787"), /http:\/\/127\.0\.0\.1:8787/);
  for (const value of [
    "http://api.example.org",
    "https://api.example.org/path",
    "https://user:pass@api.example.org",
    "https://api.example.org?token=no",
  ]) {
    assert.throws(() => createAuthConfig(value));
  }
});
