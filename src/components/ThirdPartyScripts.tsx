"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

type SlickOptions = Record<string, unknown>;

type LenisInstance = {
  start?: () => void;
  stop?: () => void;
  destroy?: () => void;
  resize?: () => void;
};

type LenisOptions = {
  autoRaf?: boolean;
  anchors?: boolean;
  allowNestedScroll?: boolean;
};

interface JQueryCollectionLike {
  length: number;
  hasClass: (className: string) => boolean;
  slick: (options: SlickOptions) => JQueryCollectionLike;
}

interface JQueryStaticLike {
  (selector: string): JQueryCollectionLike;
  fn?: {
    slick?: unknown;
  };
}

interface AosLike {
  init: (options: { easing: string; duration: number }) => void;
  refresh?: () => void;
  refreshHard?: () => void;
}

declare global {
  interface Window {
    Lenis?: new (options?: LenisOptions) => LenisInstance;
    $?: JQueryStaticLike;
    jQuery?: JQueryStaticLike;
    AOS?: AosLike;
  }
}

const AOS_OPTIONS = {
  easing: "ease-out-back",
  duration: 1000,
};

const HERO_SLIDER_OPTIONS: SlickOptions = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
  speed: 300,
  infinite: true,
  autoplaySpeed: 3000,
  autoplay: true,
};

const PRODUCT_DETAIL_MAIN_SLIDER_OPTIONS: SlickOptions = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: ".product-slider-nav",
  autoplay: false,
};

const PRODUCT_DETAIL_NAV_SLIDER_OPTIONS: SlickOptions = {
  slidesToShow: 6,
  slidesToScroll: 1,
  asNavFor: ".product-slider-for",
  dots: false,
  centerMode: false,
  focusOnSelect: true,
  infinite: true,
};

function closeMobileMenu() {
  document.getElementById("hamburger")?.classList.remove("open");
  document.getElementById("mobileMenu")?.classList.remove("open");
  document.getElementById("productsAccordionBtn")?.classList.remove("open");
  document.getElementById("productsAccordionBody")?.classList.remove("open");
  document.body.classList.remove("mobile-menu-open");
  document.body.style.overflow = "";
}

function getJQuery() {
  return window.jQuery ?? window.$;
}

function initializeSlider($: JQueryStaticLike, selector: string, options: SlickOptions) {
  const slider = $(selector);
  if (!slider.length || slider.hasClass("slick-initialized")) {
    return;
  }

  slider.slick(options);
}

export function ThirdPartyScripts() {
  const pathname = usePathname();
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const accordionButton = document.getElementById("productsAccordionBtn");
    const accordionBody = document.getElementById("productsAccordionBody");

    if (!hamburger || !mobileMenu || !accordionButton || !accordionBody) {
      return;
    }

    const toggleMenu = () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      const isOpen = mobileMenu.classList.contains("open");
      document.body.style.overflow = isOpen ? "hidden" : "";
      document.body.classList.toggle("mobile-menu-open", isOpen);
      if (isOpen) {
        lenisRef.current?.stop?.();
      } else {
        lenisRef.current?.start?.();
      }
    };

    const toggleAccordion = () => {
      accordionButton.classList.toggle("open");
      accordionBody.classList.toggle("open");
    };

    const closeMenuAndEnableLenis = () => {
      closeMobileMenu();
      lenisRef.current?.start?.();
    };

    const mobileLinks = Array.from(mobileMenu.querySelectorAll<HTMLAnchorElement>(".mobile-link"));
    const accordionLinks = Array.from(accordionBody.querySelectorAll<HTMLAnchorElement>("a"));

    hamburger.addEventListener("click", toggleMenu);
    accordionButton.addEventListener("click", toggleAccordion);
    mobileLinks.forEach((link) => link.addEventListener("click", closeMenuAndEnableLenis));
    accordionLinks.forEach((link) => link.addEventListener("click", closeMenuAndEnableLenis));

    return () => {
      hamburger.removeEventListener("click", toggleMenu);
      accordionButton.removeEventListener("click", toggleAccordion);
      mobileLinks.forEach((link) => link.removeEventListener("click", closeMenuAndEnableLenis));
      accordionLinks.forEach((link) => link.removeEventListener("click", closeMenuAndEnableLenis));
      closeMobileMenu();
    };
  }, []);

  useEffect(() => {
    closeMobileMenu();
    lenisRef.current?.start?.();

    let attempts = 0;
    let cancelled = false;
    let frameId = 0;
    let timeoutId: number | undefined;

    const initializeUi = () => {
      if (cancelled) {
        return;
      }

      if (!lenisRef.current && window.Lenis && window.innerWidth > 991.98) {
        lenisRef.current = new window.Lenis({
          autoRaf: true,
          anchors: true,
          allowNestedScroll: false,
        });
      }

      const jquery = getJQuery();
      const needsLenis = window.innerWidth > 991.98;
      if (!jquery || typeof jquery.fn?.slick !== "function" || !window.AOS || (needsLenis && !lenisRef.current)) {
        attempts += 1;
        if (attempts < 40) {
          timeoutId = window.setTimeout(initializeUi, 150);
        }
        return;
      }

      initializeSlider(jquery, ".hero-slider", HERO_SLIDER_OPTIONS);
      initializeSlider(jquery, ".product-slider-for", PRODUCT_DETAIL_MAIN_SLIDER_OPTIONS);
      initializeSlider(jquery, ".product-slider-nav", PRODUCT_DETAIL_NAV_SLIDER_OPTIONS);

      window.AOS.init(AOS_OPTIONS);
      window.AOS.refreshHard?.();
      window.AOS.refresh?.();
      lenisRef.current?.resize?.();
    };

    frameId = window.requestAnimationFrame(initializeUi);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      if (typeof timeoutId === "number") {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      lenisRef.current?.destroy?.();
      lenisRef.current = null;
    };
  }, []);

  return (
    <>
      <Script src="/assets/js/jquery.min.js" strategy="beforeInteractive" />
      <Script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
        strategy="beforeInteractive"
      />
      <Script src="/assets/js/slick.min.js" strategy="afterInteractive" />
      <Script src="https://unpkg.com/lenis@1.3.11/dist/lenis.min.js" strategy="afterInteractive" />
      <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
    </>
  );
}
