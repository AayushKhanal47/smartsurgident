import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { usePageMeta } from "../../hooks/usePageMeta";
import { getNewsPosts } from "../../api/endpoints";
import type { NewsPost } from "../../api/endpoints";

export default function CompanyNews() {
  const [posts, setPosts] = useState<NewsPost[] | null>(null);

  useEffect(() => {
    getNewsPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  usePageMeta("News & Updates", "Announcements and updates from Smart Surgident.");

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "News" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            News & updates
          </h1>
          <p className="text-brand-slate text-sm md:text-base mb-10">
            What's new at Smart Surgident — new brands, new dealer cities, and platform updates.
          </p>
        </Reveal>

        {posts && posts.length === 0 && (
          <p className="text-sm text-brand-muted">No news posted yet — check back soon.</p>
        )}

        <div className="flex flex-col divide-y divide-brand-border">
          {posts?.map((post, i) => (
            <Reveal key={post._id} delay={i * 0.05} className="py-6 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <p className="mt-1.5 text-base font-display font-semibold text-brand-navy">{post.title}</p>
              <p className="mt-1.5 text-sm text-brand-slate leading-relaxed whitespace-pre-line">{post.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
