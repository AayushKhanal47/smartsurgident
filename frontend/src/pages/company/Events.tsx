import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Reveal from "../../components/ui/Reveal";
import { ButtonLink } from "../../components/ui/Button";
import { usePageMeta } from "../../hooks/usePageMeta";
import { getEvents } from "../../api/endpoints";
import type { EventItem } from "../../api/endpoints";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";

export default function CompanyEvents() {
  const [events, setEvents] = useState<EventItem[] | null>(null);

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  usePageMeta("Events", "Trade shows, dealer demos, and training workshops from Smart Surgident.");

  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company", to: "/company/about" }, { label: "Events" }]} />

      <div className="px-6 md:px-10 py-16 max-w-2xl">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-3">
            Events
          </h1>
          <p className="text-brand-slate text-sm md:text-base leading-relaxed mb-10">
            We take part in dental trade shows, run equipment demo days for our dealers, and hold
            training sessions when new equipment lines launch.
          </p>
        </Reveal>

        {events && events.length === 0 && (
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-brand-border bg-brand-tint/60 px-6 py-10 text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-brand-primary mb-4">
                <HiOutlineCalendar className="text-2xl" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-brand-navy">No events scheduled right now</p>
              <p className="mt-1.5 text-sm text-brand-slate max-w-sm mx-auto">
                Want to know when we're next at an event near you, or host a demo for your clinic
                or dealership? Get in touch.
              </p>
              <div className="mt-6">
                <ButtonLink to="/support/contact">Contact us</ButtonLink>
              </div>
            </div>
          </Reveal>
        )}

        <div className="flex flex-col divide-y divide-brand-border">
          {events?.map((event, i) => (
            <Reveal key={event._id} delay={i * 0.05} className="py-6 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
              <p className="mt-1.5 text-base font-display font-semibold text-brand-navy">{event.title}</p>
              {event.location && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-muted">
                  <HiOutlineLocationMarker aria-hidden="true" /> {event.location}
                </p>
              )}
              <p className="mt-1.5 text-sm text-brand-slate leading-relaxed whitespace-pre-line">{event.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
