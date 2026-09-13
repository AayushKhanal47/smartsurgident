import { useEffect, useState } from "react";
import { getAllPagesAdmin, updatePageAdmin } from "../../api/endpoints";
import type { Page } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { PageHeader, Card, Field, Textarea } from "./ui";

const LABELS: Record<string, string> = {
  about: "About Us",
  facilities: "Facilities",
  warranty: "Warranty",
};

export default function AdminPages() {
  const [forms, setForms] = useState<Record<string, { title: string; body: string }>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPagesAdmin().then((pages: Page[]) => {
      const next: Record<string, { title: string; body: string }> = {};
      pages.forEach((p) => { next[p.slug] = { title: p.title, body: p.body }; });
      setForms(next);
    });
  }, []);

  const set = (slug: string, field: "title" | "body", value: string) => {
    setForms((f) => ({ ...f, [slug]: { ...f[slug], [field]: value } }));
  };

  const save = async (slug: string) => {
    setError("");
    setSavingSlug(slug);
    setSavedSlug(null);
    try {
      await updatePageAdmin(slug, forms[slug]);
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug((s) => (s === slug ? null : s)), 2000);
    } catch {
      setError(`Failed to save "${LABELS[slug] ?? slug}"`);
    } finally {
      setSavingSlug(null);
    }
  };

  return (
    <div>
      <PageHeader title="Pages" subtitle="Long-form content shown on the public site" />

      <div className="flex flex-col gap-6 max-w-2xl">
        {Object.keys(LABELS).map((slug) => {
          const form = forms[slug];
          if (!form) return null;
          return (
            <Card key={slug} className="p-6 flex flex-col gap-3.5">
              <p className="text-sm font-semibold text-brand-navy">{LABELS[slug]}</p>
              <Field
                label="Title"
                value={form.title}
                onChange={(e) => set(slug, "title", e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <Textarea
                  label="Body"
                  rows={8}
                  value={form.body}
                  onChange={(e) => set(slug, "body", e.target.value)}
                />
                <p className="text-xs text-brand-muted">Leave a blank line between paragraphs.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => save(slug)} disabled={savingSlug === slug}>
                  {savingSlug === slug ? "Saving…" : "Save"}
                </Button>
                {savedSlug === slug && <span className="text-xs text-brand-primary font-medium">Saved</span>}
              </div>
            </Card>
          );
        })}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
