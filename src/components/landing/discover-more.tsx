"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

type Tag = "Watch Next" | "Trending" | "Recommended";

type Video = {
  id: string;
  duration: string;
  tag: Tag;
};

const VIDEOS: Video[] = [
  { id: "KwTwHLsAUV0", duration: "12:34", tag: "Watch Next" },
  { id: "qBXXr4xcGBM", duration: "08:21", tag: "Trending" },
  { id: "pd3yQULWaGA", duration: "15:46", tag: "Recommended" }
];

const TABS: Tag[] = ["Watch Next", "Trending", "Recommended"];

type Meta = {
  title: string;
  author: string;
  thumbnail: string;
};

async function fetchOEmbed(id: string): Promise<Meta> {
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

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M8 5.14v13.72c0 .9.97 1.46 1.75 1.01l11.6-6.86c.77-.46.77-1.57 0-2.03l-11.6-6.86A1.17 1.17 0 0 0 8 5.14z" />
    </svg>
  );
}

function VideoCard({
  video,
  meta,
  active,
  onSelect
}: {
  video: Video;
  meta?: Meta;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`discover-card group flex w-full items-start gap-3 rounded-2xl border p-2.5 text-left transition ${
        active
          ? "border-transparent bg-[linear-gradient(135deg,rgba(27,85,224,0.95),rgba(27,85,224,0.45))] text-white shadow-[0_10px_30px_rgba(27,85,224,0.35)]"
          : "border-white/[0.06] bg-white/[0.03] text-white/85 hover:border-white/[0.12] hover:bg-white/[0.06]"
      }`}
    >
      <span className="relative block h-[78px] w-[140px] shrink-0 overflow-hidden rounded-xl bg-black/40">
        {meta ? (
          <img
            src={meta.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
        ) : (
          <span className="block h-full w-full animate-pulse bg-white/[0.05]" />
        )}
        <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
          {video.duration}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={`line-clamp-2 text-sm font-semibold leading-snug ${
            active ? "text-white" : "text-white"
          }`}
        >
          {meta?.title ?? "Loading…"}
        </span>
        <span
          className={`mt-1 truncate text-xs ${active ? "text-white/85" : "text-white/55"}`}
        >
          {meta?.author ?? ""}
        </span>
        <span
          className={`mt-2 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            active
              ? "bg-white/15 text-white"
              : "bg-[rgba(27,85,224,0.14)] text-[var(--brand)]"
          }`}
        >
          {video.tag}
        </span>
      </span>
    </button>
  );
}

export function DiscoverMore() {
  const sectionRef = useRef<HTMLElement>(null);
  const [metas, setMetas] = useState<Record<string, Meta>>({});
  const [activeId, setActiveId] = useState<string>(VIDEOS[0].id);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState<Tag>("Watch Next");

  useEffect(() => {
    let cancelled = false;
    Promise.all(VIDEOS.map((v) => fetchOEmbed(v.id))).then((results) => {
      if (cancelled) return;
      const map: Record<string, Meta> = {};
      VIDEOS.forEach((v, i) => {
        map[v.id] = results[i];
      });
      setMetas(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
      if (prefersReducedMotion() || playing) return;
      const poster = sectionRef.current?.querySelector(".discover-feature-poster");
      if (!poster) return;
      gsap.fromTo(
        poster,
        { opacity: 0.85, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.35, ease: ZEB_EASE }
      );
    },
    { dependencies: [activeId], scope: sectionRef }
  );

  const handleSelect = (id: string) => {
    setActiveId(id);
    setPlaying(true);
  };

  const activeMeta = metas[activeId];

  return (
    <section
      id="discover-more"
      ref={sectionRef}
      className="discover-more scroll-mt-24 px-6 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">
              Discover More
            </p>
            <h2 className="mt-2 text-[clamp(1.75rem,3.5vw,2.75rem)] font-black text-[var(--text-on-dark)]">
              Watch &amp; learn
            </h2>
            <p className="mt-2 text-sm text-white/55 sm:text-base">
              Crypto guides, market explainers and ZebPay product deep-dives.
            </p>
          </div>
          <div className="flex gap-1 self-start rounded-full border border-white/[0.08] bg-white/[0.04] p-1 sm:self-auto">
            {TABS.map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={active}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-[var(--brand)] text-white shadow-[0_4px_16px_rgba(27,85,224,0.35)]"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-7">
          <div className="discover-feature relative aspect-video overflow-hidden rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-sm">
            {playing ? (
              <iframe
                key={activeId}
                src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeMeta?.title ?? "Video"}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${activeMeta?.title ?? "video"}`}
                className="discover-feature-poster group absolute inset-0 block"
              >
                {activeMeta && (
                  <img
                    src={activeMeta.thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${activeId}/hqdefault.jpg`;
                    }}
                  />
                )}
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.7)_100%)]" />
                <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--brand)] text-white shadow-[0_10px_40px_rgba(27,85,224,0.55)] transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
                  <PlayIcon className="h-7 w-7 translate-x-0.5 sm:h-8 sm:w-8" />
                </span>
                {activeMeta && (
                  <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 text-left sm:p-6">
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                        {activeMeta.author}
                      </span>
                      <span className="mt-1 line-clamp-2 text-lg font-black leading-tight text-white sm:text-2xl">
                        {activeMeta.title}
                      </span>
                    </span>
                  </span>
                )}
              </button>
            )}
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-3 backdrop-blur-sm sm:p-4">
            <div className="flex items-center justify-between px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/45">
              <span>Up next</span>
              <span>{VIDEOS.length} videos</span>
            </div>
            <div className="flex flex-col gap-2">
              {VIDEOS.map((v) => (
                <VideoCard
                  key={v.id}
                  video={v}
                  meta={metas[v.id]}
                  active={v.id === activeId}
                  onSelect={() => handleSelect(v.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
