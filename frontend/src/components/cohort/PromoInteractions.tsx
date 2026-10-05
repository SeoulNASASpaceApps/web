"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Locale } from "@/domain/content";
import type { PromoChallenge, PromoCopy, PromoFilterKey, PromoTimelineItem } from "@/content/promo";
import { getKstDateString } from "./kst";

export function PromoChallengeExplorer({
  challenges,
  locale,
  section,
  ui,
}: {
  challenges: readonly PromoChallenge[];
  locale: Locale;
  section: {
    kicker: PromoCopy;
    title: PromoCopy;
    description: PromoCopy;
    officialLink: PromoCopy;
    officialUrl: string;
    filterAriaLabel: PromoCopy;
    filters: readonly { key: PromoFilterKey; label: PromoCopy }[];
    countSuffix: PromoCopy;
    browseNote: PromoCopy;
    sourceNote: PromoCopy;
    officialChallengeLink: PromoCopy;
  };
  ui: {
    newTabHint: PromoCopy;
    orbitLabel: PromoCopy;
    challengeCount: PromoCopy;
  };
}) {
  const [activeFilter, setActiveFilter] = useState<PromoFilterKey>("all");
  const [hydrated, setHydrated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const filters = section.filters;
  const activeIndex = filters.findIndex((filter) => filter.key === activeFilter);
  const activeLabel = filters[activeIndex]?.label[locale] ?? filters[0].label[locale];
  const visibleChallenges = useMemo(
    () => challenges.filter((challenge) => activeFilter === "all" || challenge.category === activeFilter),
    [activeFilter, challenges],
  );

  useEffect(() => setHydrated(true), []);

  function selectFilter(filter: PromoFilterKey) {
    setActiveFilter(filter);
    listRef.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((details) => {
      if (filter !== "all" && details.dataset.category !== filter) details.open = false;
    });
  }

  const countText = locale === "ko"
    ? `${activeLabel} ${visibleChallenges.length}${section.countSuffix.ko}`
    : `${activeLabel} ${visibleChallenges.length}`;

  return (
    <section className="challenges section-wrap" id="challenges" aria-labelledby="challenges-title">
      <div className="challenge-intro" data-promo-reveal>
        <p className="section-kicker">{section.kicker[locale]}</p>
        <h2 id="challenges-title">{section.title[locale]}</h2>
        <p>{section.description[locale]}</p>
        <div className="challenge-orbit" style={{ "--orbit-angle": `${Math.max(activeIndex, 0) * 72}deg` } as CSSProperties} aria-hidden="true">
          <svg viewBox="0 0 320 260" fill="none">
            <ellipse cx="160" cy="130" rx="128" ry="104" />
            <ellipse cx="160" cy="130" rx="128" ry="39" transform="rotate(-28 160 130)" />
            <ellipse cx="160" cy="130" rx="54" ry="104" transform="rotate(28 160 130)" />
            <path d="M20 130h280M160 14v232" />
            <g className="orbit-marker"><circle cx="270" cy="78" r="7" /></g>
          </svg>
          <div><b>{visibleChallenges.length}</b><span>{ui.orbitLabel[locale]}</span></div>
        </div>
        <a className="text-link" href={section.officialUrl} target="_blank" rel="noopener noreferrer">
          {section.officialLink[locale]} <span aria-hidden="true">↗</span>
          <span className="promo-sr-only"> {ui.newTabHint[locale]}</span>
        </a>
      </div>
      <div className="challenge-explorer">
        <div className="challenge-filters" role="group" aria-label={section.filterAriaLabel[locale]} hidden={!hydrated}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              aria-pressed={activeFilter === filter.key}
              aria-controls="challenge-list"
              onClick={() => selectFilter(filter.key)}
            >
              {filter.label[locale]}
            </button>
          ))}
        </div>
        <p className="explorer-note">
          <span role="status" aria-live="polite">{hydrated ? countText : ui.challengeCount[locale]}</span>
          {" · "}{section.browseNote[locale]}
        </p>
        <div id="challenge-list" ref={listRef}>
          {challenges.map((challenge) => {
            const visible = activeFilter === "all" || challenge.category === activeFilter;
            return (
              <details className="challenge-item" data-category={challenge.category} hidden={hydrated && !visible} key={challenge.number}>
                <summary>
                  <span className="challenge-number">{challenge.number}</span>
                  <span><small>{challenge.categoryLabel[locale]}</small><strong>{challenge.shortTitle[locale]}</strong></span>
                  <span className="expand-icon" aria-hidden="true">+</span>
                </summary>
                <div className="challenge-content">
                  {locale === "ko" ? <p className="original-title" lang="en">{challenge.officialTitle}</p> : null}
                  <p>{challenge.summary[locale]}</p>
                  <a className="text-link" href={challenge.officialUrl} target="_blank" rel="noopener noreferrer">
                    {section.officialChallengeLink[locale]}
                    <span aria-hidden="true">↗</span>
                    <span className="promo-sr-only"> {ui.newTabHint[locale]}</span>
                  </a>
                </div>
              </details>
            );
          })}
        </div>
        <p className="source-note">{section.sourceNote[locale]}</p>
      </div>
    </section>
  );
}

export function PromoHashtagCopy({ copyFailure, copyLabel, copySuccess, hashtags, locale }: { copyFailure: PromoCopy; copyLabel: PromoCopy; copySuccess: PromoCopy; hashtags: readonly string[]; locale: Locale }) {
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState("");
  const hashtagText = hashtags.join(" ");

  useEffect(() => setHydrated(true), []);

  async function copyHashtags() {
    try {
      await navigator.clipboard.writeText(hashtagText);
      setStatus(copySuccess[locale]);
    } catch {
      setStatus(copyFailure[locale]);
    }
  }

  return (
    <div className="hashtags">
      <p>{hashtags.map((tag, index) => <span key={tag} className={index ? "hashtag-accent" : undefined}>{tag}{index === 0 ? " " : ""}</span>)}</p>
      <button type="button" hidden={!hydrated} onClick={copyHashtags}>{copyLabel[locale]}</button>
      <span className="copy-status" role="status" aria-live="polite">{status}</span>
    </div>
  );
}

export function PromoTimeline({ items, locale, pastSuffix }: { items: readonly PromoTimelineItem[]; locale: Locale; pastSuffix: PromoCopy }) {
  const [currentKstDate, setCurrentKstDate] = useState<string | null>(null);

  useEffect(() => {
    const updateCurrentDate = () => setCurrentKstDate(getKstDateString());
    updateCurrentDate();
    const interval = window.setInterval(updateCurrentDate, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const pastItems = currentKstDate
    ? items.map((item) => item.endDate ? currentKstDate >= item.endDate : currentKstDate > item.date)
    : items.map(() => false);
  const nextIndex = currentKstDate ? pastItems.findIndex((isPast) => !isPast) : -1;

  return (
    <ol className="timeline">
      {items.map((item, index) => {
        const classes = [
          item.highlighted ? "hackathon-date" : "",
          pastItems[index] ? "is-past" : "",
          index === nextIndex ? "is-next" : "",
        ].filter(Boolean).join(" ");

        return (
          <li
            className={classes || undefined}
            data-date={item.date}
            data-end-date={item.endDate}
            key={item.date}
          >
            <time dateTime={item.date}>{item.displayDate[locale]}</time>
            <div>
              <h3>
                {item.title[locale]}
                {pastItems[index] ? <span className="promo-sr-only"> {pastSuffix[locale]}</span> : null}
              </h3>
              <p>{item.description[locale]}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function PromoInteractions() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".promo-home");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>("[data-promo-reveal], .steps li"));
    let revealObserver: IntersectionObserver | null = null;

    const revealAll = () => revealTargets.forEach((target) => target.classList.remove("reveal-pending"));
    if ("IntersectionObserver" in window && !reducedMotion.matches) {
      revealTargets.forEach((target) => target.classList.add("reveal-pending"));
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.remove("reveal-pending");
          revealObserver?.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      revealTargets.forEach((target) => revealObserver?.observe(target));
    }

    const handleMotionChange = () => {
      if (!reducedMotion.matches) return;
      revealObserver?.disconnect();
      revealAll();
    };
    reducedMotion.addEventListener("change", handleMotionChange);

    const navLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>(".section-nav .nav-inner a[href^='#']"));
    const sections = navLinks.map((link) => root.querySelector<HTMLElement>(link.hash));
    const progress = root.querySelector<HTMLElement>(".reading-progress");
    const detailElements = Array.from(root.querySelectorAll<HTMLDetailsElement>(".challenge-item, .faq-list details"));
    let scrollQueued = false;

    const updateScroll = () => {
      const travel = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) {
        const amount = travel > 0 ? Math.min(1, Math.max(0, window.scrollY / travel)) : 0;
        progress.style.transform = `scaleX(${amount})`;
      }

      const threshold = window.innerWidth <= 760 ? 126 : 134;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let activeIndex = atBottom ? sections.length - 1 : -1;
      if (!atBottom) {
        sections.forEach((section, index) => {
          if (section && section.getBoundingClientRect().top <= threshold) activeIndex = index;
        });
      }
      navLinks.forEach((link, index) => {
        if (index === activeIndex) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      scrollQueued = false;
    };

    const queueScrollUpdate = () => {
      if (scrollQueued) return;
      scrollQueued = true;
      window.requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", queueScrollUpdate, { passive: true });
    window.addEventListener("resize", queueScrollUpdate);
    detailElements.forEach((details) => details.addEventListener("toggle", queueScrollUpdate));
    updateScroll();

    return () => {
      revealObserver?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
      window.removeEventListener("scroll", queueScrollUpdate);
      window.removeEventListener("resize", queueScrollUpdate);
      detailElements.forEach((details) => details.removeEventListener("toggle", queueScrollUpdate));
    };
  }, []);

  return null;
}
