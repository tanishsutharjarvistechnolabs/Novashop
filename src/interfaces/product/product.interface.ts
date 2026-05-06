import type { Banner } from "@/interfaces/shared/shared.interface";

export interface ProductCategoryData {
  id: string;
  name: string;
  count: number;
  href: string;
}

export interface ProductListItem {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  detailsHref: string;
  actionLabel: string;
  actionHref: string;
}

export interface ProductPromo {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ProductDetailsTab {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface ProductPolicy {
  id: string;
  iconClassName: string;
  label: string;
}

export interface ProductTrustItem {
  id: string;
  iconClassName: string;
  label: string;
}

export interface ProductPageData {
  banner: Banner;
  categories: ProductCategoryData[];
  promo: ProductPromo;
  products: ProductListItem[];
}

export interface ProductDetailsPageData {
  banner: Banner;
  gallery: string[];
  title: string;
  sku: string;
  inventory: string;
  price: number;
  description: string[];
  policies: ProductPolicy[];
  paymentImageSrc: string;
  paymentImageAlt: string;
  tabs: ProductDetailsTab[];
  trustItems: ProductTrustItem[];
}

export interface Product {
  id: number;
  itemCode: string;
  name: string;
  shortDescription: string;
  longDescription?: string | null;
  productCategoryID: number;
  productCategoryName: string;
  itemCurrencyId: number;
  currencyCode: string;
  itemRate?: number;
  priceInKes?: number;
  discountPer?: number | null;
  isActive?: boolean;
  primaryImageUrl: string;
  additionalImages?: {
    id: number;
    imageUrl: string;
  }[];
}


export interface ProductCategory {
  productCategoryID: number;
  productCategoryName: string;
  displayOrder: number;
  shortDescription: string;
  isTopProductCategory: boolean;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  modifiedBy: number | null;
  modifiedDate: string | null;
  productCount: number;
  categoryImageUrl: string;
}
