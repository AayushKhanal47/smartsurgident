import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { csrfCookieOptions } from "../config/cookies";

const CSRF_COOKIE = "csrfToken";
const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Runs on every request (before auth) so the token is already set by the
// time a visitor logs in or submits any form — a double-submit CSRF cookie
// only works if the client already has it to echo back.
export const issueCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies?.[CSRF_COOKIE]) {
    res.cookie(CSRF_COOKIE, crypto.randomBytes(24).toString("hex"), csrfCookieOptions);
  }
  next();
};

// Applied inside `protect`, after a valid session cookie is confirmed: for
// any state-changing request, the client must also echo the CSRF cookie's
// value back as a header. An attacker's cross-site page can make the
// browser send the auth cookie (SameSite=None allows that), but it cannot
// read api.smartsurgident.com's csrfToken cookie to produce a matching
// header from a different origin — same-origin policy blocks that read.
export const verifyCsrfToken = (req: Request): boolean => {
  if (SAFE_METHODS.has(req.method)) return true;
  const cookieValue = req.cookies?.[CSRF_COOKIE];
  const headerValue = req.headers[CSRF_HEADER];
  return Boolean(cookieValue) && typeof headerValue === "string" && headerValue === cookieValue;
};
