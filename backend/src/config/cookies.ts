// Single source of truth for session-cookie attributes (user `token` and
// dealer `dealerToken`).
//
// In production the SPA and the API are served from different origins, so the
// cookie must be `SameSite=None` to be sent on cross-site XHR — and browsers
// only accept `SameSite=None` when it is also `Secure` (HTTPS). Locally we keep
// `SameSite=Lax` and non-secure so `http://localhost` works without TLS.
const isProduction = process.env.NODE_ENV === "production";

const sharedCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  secure: isProduction,
};

export const authCookieOptions = {
  ...sharedCookieOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

// `res.clearCookie` must be called with the same attributes (minus maxAge) the
// cookie was set with, or the browser keeps it.
export const clearCookieOptions = sharedCookieOptions;
