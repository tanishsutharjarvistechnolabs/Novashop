import type { ReactNode } from "react";
import type { CartPageData } from "@/interfaces/cart/cart.interface";
import type { CheckoutPageData } from "@/interfaces/checkout/checkout.interface";
import type { SupportSectionData } from "@/interfaces/shared/shared.interface";

export interface CartPageContentProps {
  data: CartPageData;
}

export interface CheckoutPageContentProps {
  data: CheckoutPageData;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface InnerBannerProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs?: BreadcrumbItem[];
}

export interface QuantitySelectorProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  onChange?: (value: number) => void;
  className?: string;
  inputClassName?: string;
}

export interface SectionBadgeProps {
  children: ReactNode;
  mirrored?: boolean;
  className?: string;
}

export interface StaticHtmlProps {
  html: string;
}

export interface SupportSectionProps {
  data?: SupportSectionData;
}
