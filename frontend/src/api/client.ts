import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly auth cookie
});

// CSRF double-submit: the backend sets a csrfToken cookie on
// api.smartsurgident.com, but this app runs on a different domain
// (smartsurgident.com) — JS here can never read that cookie directly via
// document.cookie, cross-origin cookie access isn't allowed regardless of
// subdomain relationship. Instead we fetch the value once from a small
// endpoint that echoes back the caller's own cookie (a normal cross-origin
// response body, unlike a cookie, IS readable here), cache it, and attach
// it as a header on every request — the server only checks it for
// state-changing requests made through `protect` (see
// backend/src/middleware/csrf.ts).
let csrfTokenPromise: Promise<string | undefined> | null = null;

function getCsrfToken(): Promise<string | undefined> {
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch(`${BASE_URL}/csrf-token`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => data.csrfToken as string | undefined)
      .catch(() => undefined);
  }
  return csrfTokenPromise;
}

// GET/HEAD/OPTIONS never carry the header — the backend's verifyCsrfToken()
// already treats those as safe methods and never checks it — but every
// request used to await the same csrf-token fetch regardless of method,
// so a page's very first reads couldn't even start until that one round
// trip finished (perf audit, P0: ~0.7-1s added to every page's initial
// data load for zero security benefit, since reads were never protected
// by it anyway).
const SAFE_METHODS = new Set(["get", "head", "options"]);

api.interceptors.request.use(async (config) => {
  if (config.method && SAFE_METHODS.has(config.method)) {
    return config;
  }
  const csrfToken = await getCsrfToken();
  if (csrfToken) {
    config.headers = config.headers ?? {};
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

export default api;
