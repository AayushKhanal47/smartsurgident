// Trims to at most `maxLength` chars, breaking on the last whitespace
// rather than mid-word, for meta descriptions built from longer copy.
export function trimToWordBoundary(text: string | undefined, maxLength: number): string | undefined {
  if (!text) return undefined;
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const cut = trimmed.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}
