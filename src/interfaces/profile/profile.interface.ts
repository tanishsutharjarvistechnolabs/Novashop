import type { Banner } from "@/interfaces/shared/shared.interface";

export interface ProfileDetails {
  fullName: string;
  mobile: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
}

export interface ProfileUser {
  fullName: string;
  email: string;
}

export interface ProfilePageData {
  banner: Banner;
  user: ProfileUser;
  details: ProfileDetails;
  countryOptions: string[];
}

export interface UserDetails {
  cityId: number;
  cityName: string;
  companyName: string;
  contactNo: string | null;
  countryId: number | null;
  countryName: string | null;
  designationID: number | null;
  email: string;
  fullName: string;
  isActive: boolean;
  personal_Identification_Number: string | null;
  stateId: number;
  stateName: string;
  streetAddress: string;
  zipcode: string | null;
  claimVAT: boolean;
}


export interface UserDetailsReqBody {
  name: string;
  email: string;
  streetAddress: string;
  cityId: number | null;
  stateId: number | null;
  countryId: number | null;
  contactNo: string;
  personal_Identification_Number?: string;
  zipCode?: string;
  companyName?: string;
  claimVAT?: boolean;
}


export interface UserDetailsError {
  name: string;
  email: string;
  streetAddress?: string;
  cityId?: string;
  stateId?: string;
  countryId?: string;
  contactNo: string;
  personal_Identification_Number?: string;
  zipCode?: string;
  companyName?: string;
}

export interface Country {
  countryCode: string;
  countryId: number;
  countryName: string;
}

export interface State {
  stateId: number;
  stateName: string;
  countryId: number;
  isActive: boolean;
}

export interface City {
  cityId: number;
  cityName: string;
  stateId: number;
  isActive: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  claimVAT: boolean;
  PIN?: string;
  companyName?: string;
}

export interface SignupDataError {
  name: string;
  email: string;
  phone: string;
  PIN?: string;
  companyName?: string;
}


export interface CreateUserReqBody {
  FullName: string;
  email: string;
  contactNo: string;
  ClaimVAT: boolean;
  PersonalIdentificationNumber?: string;
  CompanyName?: string;
}

export interface UpdateUserDetailsReqBody {
  FullName: string;
  contactNo: string;
  streetAddress: string;
  PersonalIdentificationNumber?: string;
  cityId: number | null;
  stateId: number | null;
  countryId: number | null;
  zipCode?: string;
  companyName?: string;
  claimVAT?: boolean;
}