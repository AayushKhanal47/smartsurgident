const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResponse {
  success: boolean;
}

// Verifies a Cloudflare Turnstile token server-side before accepting a public
// form submission. Mirrors the EMAIL_USER/EMAIL_PASS pattern in email.ts:
// if TURNSTILE_SECRET_KEY isn't set, skip verification rather than failing,
// so local/dev environments work without a Cloudflare account.
export const verifyTurnstileToken = async (token: unknown, remoteIp?: string): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail closed in production — a missing secret there means bot
    // protection is silently off with no visible symptom (security audit
    // finding M-7). Dev/local still passes through so contributors don't
    // need a Cloudflare account to test these forms.
    return process.env.NODE_ENV !== "production";
  }
  if (typeof token !== "string" || !token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.append("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as TurnstileVerifyResponse;
    return Boolean(data.success);
  } catch {
    return false;
  }
};
