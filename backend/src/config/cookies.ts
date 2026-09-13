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

// CSRF double-submit cookie: deliberately NOT httpOnly, because the SPA has
// to read this value itself to echo it back as a header on every
// state-changing request. Same SameSite/Secure rules as the auth cookies —
// an attacker's page can still trigger a cross-site request carrying it
// (that's what SameSite=None allows), but it cannot READ this cookie's value
// from api.smartsurgident.com's origin to put in the header, so a forged
// request can't produce a matching header — that's the actual protection.
export const csrfCookieOptions = {
  httpOnly: false,
  sameSite: sharedCookieOptions.sameSite,
  secure: sharedCookieOptions.secure,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
