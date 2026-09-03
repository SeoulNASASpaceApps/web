"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import type { BannerSlot, Locale } from "@/domain/content";

interface BannerSliderProps {
  banners: BannerSlot[];
  children: ReactNode;
  locale: Locale;
}

export default function BannerSlider({ banners, children, locale }: BannerSliderProps) {
  const slides = banners.filter((banner) => banner.image).slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const hasSlides = slides.length > 0;
  const labels = locale === "ko"
    ? { carousel: "2026 행사 이미지", pause: "슬라이드 일시정지", play: "슬라이드 재생", slide: "번 이미지 보기" }
    : { carousel: "2026 event images", pause: "Pause slides", play: "Play slides", slide: "View image" };

  return (
    <section
      className={`hero-skeleton hero-slider${hasSlides ? " hero-skeleton--with-slides" : ""}`}
      aria-labelledby="event-information-title"
      aria-roledescription={hasSlides ? "carousel" : undefined}
      aria-label={hasSlides ? labels.carousel : undefined}
    >
      {hasSlides ? (
        <div className="hero-slider__media" aria-hidden="true">
          {slides.map((slide, index) => (
            <div
              className={`hero-slider__slide${index === activeIndex ? " is-active" : ""}`}
              key={slide.id}
            >
              <Image
                src={slide.image!}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 760px) calc(100vw - 28px), 1180px"
              />
            </div>
          ))}
          <div className="hero-slider__shade" />
        </div>
      ) : null}

      <div className="hero-slider__content">{children}</div>

      {slides.length > 1 ? (
        <div className="hero-slider__controls">
          <div className="hero-slider__dots">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.id}
                className={index === activeIndex ? "is-active" : ""}
                aria-label={locale === "ko" ? `${index + 1}${labels.slide}` : `${labels.slide} ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button
            className="hero-slider__toggle"
            type="button"
            aria-label={paused ? labels.play : labels.pause}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? "▶" : "Ⅱ"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
