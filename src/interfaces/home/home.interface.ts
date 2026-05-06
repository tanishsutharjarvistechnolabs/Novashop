import type { SectionIntro, SectionIntroWithImage } from "@/interfaces/shared/shared.interface";

export interface HomeHeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomeCard {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export interface ServiceCard {
  id: string;
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export interface HomePageData {
  heroSlides: HomeHeroSlide;
  featuredIntro: SectionIntro;
  featuredProducts: HomeCard[];
  servicesIntro: SectionIntroWithImage;
  services: ServiceCard[];
}
