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
  if (!secret) return true;
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
