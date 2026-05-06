import type { Banner } from "@/interfaces/shared/shared.interface";

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
}

export interface CartPageData {
  banner: Banner;
  items: CartItem[];
  vatRate: number;
  deliveryFee: number;
}

export interface CartReqBody {
  productId: number;
  price: number;
  quantity: number;
}
