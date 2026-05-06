import type { Banner } from "@/interfaces/shared/shared.interface";

export interface CheckoutOption {
  id: number;
  title: string;
  description: string;
  badge: string;
  badgeClassName: string;
}

export interface AddressCard {
  label: string;
  name: string;
  lines: string[];
  phone: string;
  mapLabel?: string;
}

export interface CustomerField {
  id: string;
  placeholder: string;
  className: string;
}

export interface CheckoutPageData {
  banner: Banner;
  vatRate: number;
  deliveryFee: number;
  deliveryOptions: CheckoutOption[];
  paymentOptions: CheckoutOption[];
  deliveryAddress: AddressCard;
  warehouseAddress: AddressCard;
  cardFields: CustomerField[];
  customerFields: CustomerField[];
  countries: string[];
}
