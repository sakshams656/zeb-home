"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import type {
  AnnouncementCard,
  AnnouncementCardsConfig,
  HomeScreenBodySection
} from "@/lib/home-screen-layout";
import {
  isWebLink,
  parseAnnouncementCards
} from "@/lib/home-screen-layout";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

type AnnouncementsProps = {
  section: HomeScreenBodySection | null;
};

function AnnouncementItem({ card }: { card: AnnouncementCard }) {
  const href = isWebLink(card.click_action.deeplink)
    ? card.click_action.deeplink
    : undefined;

  const inner = (
    <>
      {card.icon_identifier ? (
        <img
          src={card.icon_identifier}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold text-[var(--fg)]">{card.title}</span>
        <span className="mt-1.5 block text-base leading-relaxed text-[var(--fg-muted)]">
          {card.description}
        </span>
      </span>
    </>
  );

  const className =
    "announcement-card flex w-full min-w-[320px] max-w-[440px] shrink-0 items-center gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left transition hover:border-[var(--border-strong)] sm:min-w-[340px]";
  const accentStyle = {
    borderLeftWidth: 4,
    borderLeftStyle: "solid" as const,
    borderLeftColor: card.stroke_color
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={accentStyle}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={className} style={accentStyle}>
      {inner}
    </div>
  );
}

export function Announcements({ section }: AnnouncementsProps) {
  const ref = useRef<HTMLElement>(null);

  if (!section) return null;

  const cards = parseAnnouncementCards(section);
  if (cards.length === 0) return null;

  const config = section.config as AnnouncementCardsConfig;
  const heading = config.header?.title?.trim() || "Announcements";

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current.querySelectorAll(".announcement-card"),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="announcements-section scroll-mt-24 px-6 py-12 lg:py-16"
      style={{ background: "var(--section-bg-1)" }}
      aria-labelledby="announcements-heading"
    >
      <div className="mx-auto max-w-[1200px]">
        <h2
          id="announcements-heading"
          className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]"
        >
          {heading}
        </h2>
        <div className="mt-5 flex gap-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((card, i) => (
            <AnnouncementItem key={`${card.title}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
