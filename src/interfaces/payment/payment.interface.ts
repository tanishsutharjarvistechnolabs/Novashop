import { UserDetails } from "../profile/profile.interface";

export interface WarehouseAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  contactNumber: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
  warehouseCode: string;
  warehouseId: number;
}

export interface GuestUserReqBody {
  FullName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  StreetAddress: string;
  cityId: number;
  stateId: number;
  countryId: number;
}


export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface CreateOrderPayload {
  warehouseId?: number;
  paymentMode: number;
  deliveryMode?: number;
  deliveryAddress?: string;
  totalDiscount: number;
  vatAmount: number;
  deliveryCharges: number;
  orderItems: OrderItem[];
}

export interface GuestUserDetails {
  FullName: string;
  contactNo: string;
  email: string;
  streetAddress?: string;
  zipCode?: string;
  cityId?: number | null;
  stateId?: number | null;
  countryId?: number | null;
}
export interface GuestUserDetailsError {
  name: string;
  email: string;
  streetAddress?: string;
  cityId?: string;
  stateId?: string;
  countryId?: string;
  contactNo?: string;
  zipCode?: string;
}

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CardDetailsError {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface GuestUserResponse {
  userDetails: UserDetails;
  guestUserToken: string;
}