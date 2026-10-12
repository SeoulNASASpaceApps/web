function normalizeApiBaseUrl(value) {
  const input = String(value || "").trim();
  if (!input) return "";
  const url = new URL(input);
  const local = ["127.0.0.1", "localhost"].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || !["", "/"].includes(url.pathname)) {
    throw new Error("MY_SPACE_API_BASE_URL must be an origin without credentials, path, query or fragment.");
  }
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error("MY_SPACE_API_BASE_URL must use HTTPS outside localhost.");
  }
  return url.origin;
}

export function createAuthConfig(value) {
  const backendBaseUrl = normalizeApiBaseUrl(value);
  return `window.SEOUL_HUB_AUTH_CONFIG = Object.freeze(${JSON.stringify({
    backendBaseUrl,
    enabledProviders: ["google", "naver"],
  }, null, 2)});\n`;
}
