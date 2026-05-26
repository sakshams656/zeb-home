"use client";

import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { useGSAP } from "@gsap/react";
import type { HomeScreenBodySection, InfoCardGroup, InfoCardItem } from "@/lib/home-screen-layout";
import {
  isWebLink,
  parseInfoCardGroups,
  youtubeVideoId
} from "@/lib/home-screen-layout";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

type DiscoverMoreProps = {
  section: HomeScreenBodySection | null;
};

type VideoMeta = {
  title: string;
  author: string;
  thumbnail: string;
};

async function fetchOEmbed(id: string): Promise<VideoMeta> {
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=https://youtu.be/${id}&format=json`,
      { cache: "force-cache" }
    );
    if (!r.ok) throw new Error("oembed failed");
    const j = (await r.json()) as { title?: string; author_name?: string };
    return {
      title: j.title ?? "ZebPay video",
      author: j.author_name ?? "ZebPay",
      thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    };
  } catch {
    return {
      title: "ZebPay video",
      author: "ZebPay",
      thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    };
  }
}

/** Keep wheel/trackpad scroll inside the list instead of Lenis page scroll. */
function handleSidebarWheel(e: WheelEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  if (el.scrollHeight <= el.clientHeight) return;

  const atTop = el.scrollTop <= 0;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
  const scrollingUp = e.deltaY < 0;
  const scrollingDown = e.deltaY > 0;

  if ((scrollingUp && !atTop) || (scrollingDown && !atBottom)) {
    e.stopPropagation();
  }
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M8 5.14v13.72c0 .9.97 1.46 1.75 1.01l11.6-6.86c.77-.46.77-1.57 0-2.03l-11.6-6.86A1.17 1.17 0 0 0 8 5.14z" />
    </svg>
  );
}

function parseEventDetails(description: string) {
  const dateMatch = description.match(/Date:\s*([^\n]+)/i);
  const locationMatch = description.match(/Location:\s*([^\n]+)/i);
  return {
    date: dateMatch?.[1]?.trim(),
    location: locationMatch?.[1]?.trim()
  };
}

function EventFeatured({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href?: string;
}) {
  const { date, location } = parseEventDetails(description);
  const shellClass =
    "discover-feature discover-event-feature flex h-full w-full flex-col overflow-hidden";

  const content = (
    <div className="flex h-full flex-col justify-center gap-3 border-l-4 border-[var(--brand)] bg-[var(--bg-elevated)] p-6 sm:gap-4 sm:p-8 lg:p-10">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
        Event
      </p>
      <h3 className="text-xl font-black leading-tight text-[var(--fg)] sm:text-2xl lg:text-3xl">
        {title}
      </h3>
      {date ? (
        <p className="text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
          <span className="font-semibold text-[var(--fg)]">When · </span>
          {date}
        </p>
      ) : null}
      {location ? (
        <p className="text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
          <span className="font-semibold text-[var(--fg)]">Where · </span>
          {location}
        </p>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shellClass} transition hover:opacity-[0.98]`}
      >
        {content}
      </a>
    );
  }

  return <div className={shellClass}>{content}</div>;
}

function itemLabel(item: InfoCardItem, group: InfoCardGroup): string {
  if (group.source === "event" && item.eventTitle) return item.eventTitle;
  return item.description;
}

function itemSubtitle(item: InfoCardItem, group: InfoCardGroup): string {
  if (group.source === "event" && item.eventDescription) {
    return item.eventDescription.replace(/\n/g, " · ");
  }
  if (group.source === "blogs") return "ZebPay Blog";
  if (group.source === "video") return "YouTube";
  return "";
}

function SidebarCard({
  item,
  group,
  active,
  onSelect
}: {
  item: InfoCardItem;
  group: InfoCardGroup;
  active: boolean;
  onSelect: () => void;
}) {
  const label = itemLabel(item, group);
  const subtitle = itemSubtitle(item, group);
  const isEvent = group.source === "event";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`discover-card group flex w-full flex-col items-stretch gap-3 rounded-2xl border p-2.5 text-left transition sm:flex-row sm:items-start ${
        isEvent ? "border-l-[3px] border-l-[var(--brand)] sm:pl-3.5" : ""
      } ${
        active
          ? "border-transparent text-[var(--fg)]"
          : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] hover:border-[var(--border-strong)]"
      }`}
      style={
        active
          ? {
              background:
                "linear-gradient(135deg, rgba(var(--brand-rgb), 0.95), rgba(var(--brand-rgb), 0.45))",
              boxShadow: "0 10px 30px rgba(var(--brand-rgb), 0.35)",
              borderLeftColor: isEvent ? "transparent" : undefined
            }
          : undefined
      }
    >
      {!isEvent ? (
        <span
          className="relative block h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-[78px] sm:w-[140px]"
          style={{ background: "var(--surface-strong)" }}
        >
          <img
            src={item.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-2 text-sm font-semibold leading-snug">{label}</span>
        {subtitle ? (
          <span
            className={`mt-1 line-clamp-2 text-xs ${
              active ? "text-[var(--fg)]/80" : "text-[var(--fg-muted)]"
            }`}
          >
            {subtitle}
          </span>
        ) : null}
        <span
          className={`mt-2 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            active ? "bg-[var(--surface-strong)] text-[var(--fg)]" : "text-[var(--brand)]"
          }`}
          style={active ? undefined : { background: "rgba(var(--brand-rgb), 0.14)" }}
        >
          {group.title}
        </span>
      </span>
    </button>
  );
}

export function DiscoverMore({ section }: DiscoverMoreProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const groups = useMemo(
    () => (section ? parseInfoCardGroups(section) : []),
    [section]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoMetas, setVideoMetas] = useState<Record<string, VideoMeta>>({});

  const activeGroup = groups[tabIndex];
  const items = activeGroup?.items ?? [];
  const activeItem = items[activeIndex];
  const isVideoTab = activeGroup?.source === "video";
  const isEventTab = activeGroup?.source === "event";
  const activeVideoId =
    activeItem && isVideoTab
      ? youtubeVideoId(activeItem.click_action.deeplink)
      : null;

  useEffect(() => {
    setActiveIndex(0);
    setPlaying(false);
  }, [tabIndex]);

  useEffect(() => {
    if (!isVideoTab) return;
    const ids = new Set<string>();
    for (const g of groups) {
      if (g.source !== "video") continue;
      for (const item of g.items) {
        const id = youtubeVideoId(item.click_action.deeplink);
        if (id) ids.add(id);
      }
    }
    if (ids.size === 0) return;

    let cancelled = false;
    Promise.all(
      [...ids].map(async (id) => ({ id, meta: await fetchOEmbed(id) }))
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, VideoMeta> = {};
      for (const { id, meta } of results) map[id] = meta;
      setVideoMetas(map);
    });
    return () => {
      cancelled = true;
    };
  }, [groups, isVideoTab]);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".discover-feature, .discover-card"),
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.55,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || playing || !isVideoTab) return;
      const poster = sectionRef.current?.querySelector(".discover-feature-poster");
      if (!poster) return;
      gsap.fromTo(
        poster,
        { opacity: 0.85, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.35, ease: ZEB_EASE }
      );
    },
    { dependencies: [activeVideoId, playing, isVideoTab], scope: sectionRef }
  );

  if (!section || groups.length === 0) return null;

  const config = section.config as { header?: { title?: string } };
  const sectionTitle = config.header?.title?.trim() || "Discover More";

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    if (isVideoTab) setPlaying(true);
  };

  const activeMeta = activeVideoId ? videoMetas[activeVideoId] : undefined;
  const featuredTitle = activeItem ? itemLabel(activeItem, activeGroup) : "";
  const featuredSubtitle = activeItem ? itemSubtitle(activeItem, activeGroup) : "";
  const featuredImage = activeItem?.image_url;
  const featuredHref =
    activeItem && isWebLink(activeItem.click_action.deeplink)
      ? activeItem.click_action.deeplink
      : undefined;

  return (
    <section
      id="discover-more"
      ref={sectionRef}
      className="discover-more scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">
              {sectionTitle}
            </p>
            <h2 className="mt-2 text-[clamp(1.75rem,3.5vw,2.75rem)] font-black text-[var(--fg)]">
              Watch, read &amp; join
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)] sm:text-base">
              Crypto guides, market explainers, blogs and community events from ZebPay.
            </p>
          </div>
          <div className="flex gap-1 self-start rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 sm:self-auto">
            {groups.map((g, i) => {
              const active = tabIndex === i;
              return (
                <button
                  key={g.source}
                  type="button"
                  onClick={() => setTabIndex(i)}
                  aria-pressed={active}
                  className={`min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--brand)] text-white shadow-[0_4px_16px_rgba(var(--brand-rgb),0.35)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {g.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-7">
          <div
            className={`discover-feature relative overflow-hidden rounded-3xl border border-[var(--border)] backdrop-blur-sm ${
              isEventTab ? "min-h-[360px] lg:min-h-[400px]" : "aspect-video"
            }`}
            style={{ background: "var(--surface)" }}
          >
            {isEventTab && activeItem ? (
              <EventFeatured
                title={featuredTitle}
                description={activeItem.eventDescription ?? featuredSubtitle}
                href={featuredHref}
              />
            ) : isVideoTab && activeVideoId ? (
              playing ? (
                <iframe
                  key={activeVideoId}
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeMeta?.title ?? featuredTitle}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={`Play ${activeMeta?.title ?? featuredTitle}`}
                  className="discover-feature-poster group absolute inset-0 block"
                >
                  <img
                    src={activeMeta?.thumbnail ?? featuredImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`;
                    }}
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.88)_100%)]" />
                  <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--brand)] text-white shadow-[0_10px_40px_rgba(var(--brand-rgb),0.55)] transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
                    <PlayIcon className="h-7 w-7 translate-x-0.5 sm:h-8 sm:w-8" />
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 text-left sm:p-6">
                    <span className="min-w-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                        {activeMeta?.author ?? "YouTube"}
                      </span>
                      <span className="mt-1 line-clamp-2 text-lg font-black leading-tight text-white sm:text-2xl">
                        {activeMeta?.title ?? featuredTitle}
                      </span>
                    </span>
                  </span>
                </button>
              )
            ) : featuredImage ? (
              featuredHref ? (
                <a
                  href={featuredHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="discover-feature-poster group absolute inset-0 block"
                >
                  <img
                    src={featuredImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_40%,rgba(0,0,0,0.75)_100%)]" />
                  <span className="absolute bottom-0 left-0 right-0 p-5 text-left sm:p-6">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                      {activeGroup.title}
                    </span>
                    <span className="mt-1 line-clamp-2 text-lg font-black leading-tight text-[var(--fg)] sm:text-2xl">
                      {featuredTitle}
                    </span>
                    {featuredSubtitle ? (
                      <span className="mt-2 line-clamp-3 text-sm text-[var(--fg-muted)]">
                        {featuredSubtitle}
                      </span>
                    ) : null}
                    <span className="mt-4 inline-flex rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white">
                      {activeGroup.source === "blogs" ? "Read article" : "View details"}
                    </span>
                  </span>
                </a>
              ) : (
                <div className="absolute inset-0">
                  <img
                    src={featuredImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_40%,rgba(0,0,0,0.75)_100%)]" />
                  <span className="absolute bottom-0 left-0 right-0 p-5 text-left sm:p-6">
                    <span className="mt-1 line-clamp-2 text-lg font-black leading-tight text-[var(--fg)] sm:text-2xl">
                      {featuredTitle}
                    </span>
                    {featuredSubtitle ? (
                      <span className="mt-2 line-clamp-3 text-sm text-[var(--fg-muted)]">
                        {featuredSubtitle}
                      </span>
                    ) : null}
                  </span>
                </div>
              )
            ) : null}
          </div>

          <div
            className="flex max-h-[min(520px,65vh)] flex-col rounded-3xl border border-[var(--border)] p-3 backdrop-blur-sm sm:p-4"
            style={{ background: "var(--surface)" }}
          >
            <div className="flex shrink-0 items-center justify-between px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
              <span>{activeGroup.title}</span>
              <span>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div
              data-lenis-prevent
              onWheel={handleSidebarWheel}
              className="discover-sidebar-list min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5"
              tabIndex={0}
              aria-label={`${activeGroup.title} list`}
            >
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <SidebarCard
                    key={`${activeGroup.source}-${itemLabel(item, activeGroup)}-${i}`}
                    item={item}
                    group={activeGroup}
                    active={i === activeIndex}
                    onSelect={() => handleSelect(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
