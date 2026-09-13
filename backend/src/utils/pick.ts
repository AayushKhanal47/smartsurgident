// Extracts only the given keys from a source object — used to whitelist
// which fields of req.body reach Model.create()/findByIdAndUpdate(), so an
// admin request body with unexpected extra fields can't silently set them
// (security audit finding M-2).
export function pick<T extends Record<string, unknown>>(
  source: T,
  keys: readonly (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of keys) {
    if (key in source) result[key] = source[key];
  }
  return result;
}
