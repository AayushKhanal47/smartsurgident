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
  // TEMPORARY diagnostic — presence/length only, never the actual value.
  // Remove once the "Verification failed" investigation is resolved.
  console.log(
    `[turnstile-debug] secret present: ${!!secret}, length: ${secret?.length ?? 0}, tokenType: ${typeof token}, tokenLength: ${typeof token === "string" ? token.length : "n/a"}`
  );
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
    const data = (await res.json()) as TurnstileVerifyResponse & { "error-codes"?: string[] };
    // TEMPORARY diagnostic — Cloudflare's error-codes are documented and
    // non-sensitive (e.g. "invalid-input-secret", "timeout-or-duplicate").
    console.log(`[turnstile-debug] siteverify response: success=${data.success}, error-codes=${JSON.stringify(data["error-codes"] ?? [])}`);
    return Boolean(data.success);
  } catch (err) {
    console.log(`[turnstile-debug] fetch to siteverify threw: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
};
