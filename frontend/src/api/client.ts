import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
  withCredentials: true, // sends the httpOnly auth cookie
});

// CSRF double-submit: the backend sets a readable (non-httpOnly) csrfToken
// cookie for every visitor; every authenticated mutation must echo it back
// as a header, or the server rejects it (see backend/src/middleware/csrf.ts).
// Harmless to attach on every request, including public/unauthenticated
// ones and GETs — the server only checks it for state-changing requests
// made through `protect`.
const readCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

api.interceptors.request.use((config) => {
  const csrfToken = readCookie("csrfToken");
  if (csrfToken) {
    config.headers = config.headers ?? {};
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

export default api;
