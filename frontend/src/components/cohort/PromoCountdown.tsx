"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/domain/content";
import { promoContent } from "@/content/promo";
import { getCalendarDayDifference, getKstDateString } from "./kst";

const HACKATHON_DATE = "2026-11-14";
const HACKATHON_START = Date.parse("2026-11-14T00:00:00+09:00");
const HACKATHON_END = Date.parse("2026-11-16T00:00:00+09:00");

type CountdownState =
  | { kind: "before"; calendarDays: number; days: number; hours: number; minutes: number }
  | { kind: "live"; isOpeningDay: boolean }
  | { kind: "ended" };

function getCountdownState(now: number): CountdownState {
  if (now >= HACKATHON_END) return { kind: "ended" };

  const kstDate = getKstDateString(new Date(now));
  if (now >= HACKATHON_START) {
    return { kind: "live", isOpeningDay: kstDate === HACKATHON_DATE };
  }

  const remainingMinutes = Math.max(0, Math.floor((HACKATHON_START - now) / 60_000));
  return {
    kind: "before",
    calendarDays: getCalendarDayDifference(kstDate, HACKATHON_DATE),
    days: Math.floor(remainingMinutes / 1_440),
    hours: Math.floor((remainingMinutes % 1_440) / 60),
    minutes: remainingMinutes % 60,
  };
}

export default function PromoCountdown({ locale }: { locale: Locale }) {
  const [countdown, setCountdown] = useState<CountdownState | null>(null);
  const copy = promoContent.countdown;

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdownState(Date.now()));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  let content = <span className="promo-countdown-placeholder" aria-hidden="true">D-—</span>;
  let stateLabel = "";

  if (countdown?.kind === "before") {
    const duration = locale === "ko"
      ? `${countdown.days}${copy.days.ko} ${countdown.hours}${copy.hours.ko} ${countdown.minutes}${copy.minutes.ko}`
      : `${countdown.days} ${countdown.days === 1 ? copy.day.en : copy.days.en} ${countdown.hours} ${countdown.hours === 1 ? copy.hour.en : copy.hours.en} ${countdown.minutes} ${countdown.minutes === 1 ? copy.minute.en : copy.minutes.en}`;
    stateLabel = `D-${countdown.calendarDays}, ${copy.until[locale]}, ${duration}`;
    content = (
      <>
        <span className="promo-countdown-heading"><strong>D-{countdown.calendarDays}</strong><span>{copy.until[locale]}</span></span>
        <span className="promo-countdown-detail">{duration}</span>
      </>
    );
  } else if (countdown?.kind === "live") {
    stateLabel = countdown.isOpeningDay
      ? `D-DAY · ${copy.live[locale]}`
      : copy.live[locale];
    content = <span className="promo-countdown-heading"><strong>{stateLabel}</strong></span>;
  } else if (countdown?.kind === "ended") {
    stateLabel = copy.ended[locale];
    content = <span className="promo-countdown-heading"><strong>{stateLabel}</strong></span>;
  }

  const accessibleLabel = stateLabel
    ? `${copy.ariaLabel[locale]}: ${stateLabel}`
    : copy.ariaLabel[locale];

  return (
    <div className="promo-countdown-slot" role="timer" aria-live="off" aria-label={accessibleLabel}>
      {content}
    </div>
  );
}
