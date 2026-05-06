import { type AxiosResponse } from "axios";
import { apiClient } from "./client";
import { CartReqBody, CreateUserReqBody, PaginationQuery, UpdateUserDetailsReqBody, UserDetailsReqBody } from "@/interfaces";
import { CreateOrderPayload, GuestUserDetails } from "@/interfaces/payment/payment.interface";
import { OTP_SEND_TYPE } from "../enum";


export const APIToGeneratePublicToken = async (): Promise<AxiosResponse> => {
    return await apiClient.get(`/Auth/generatepublictoken`);
};

export const APIToSendOtp = async (
    email: string,
    OtpType: number = OTP_SEND_TYPE.LOGIN
): Promise<AxiosResponse> => {
    return await apiClient.post("/Login/send-otp", { email, OtpType });
};

export const APIToVerifyOtp = async (
    email: string,
    otp: string,
): Promise<AxiosResponse> => {
    return await apiClient.post(
        "/Login/verify-otp",
        {
            email,
            otp,
        },
    );
}

export const APIToGetAllProducts = async ({
    page,
    pageSize,
}: PaginationQuery): Promise<AxiosResponse> => {
    return await apiClient.get(`/Product/GetAllProducts?page=${page}&pageSize=${pageSize}`);
}

export const APIToGetAllCategories = async ({
    page,
    pageSize,
}: PaginationQuery): Promise<AxiosResponse> => {
    return await apiClient.get(`/ProductCategory/GetAllCategories?page=${page}&pageSize=${pageSize}`);
}

export const APIToGetProductsByCategory = async (
    categoryId: number): Promise<AxiosResponse> => {
    return await apiClient.get(`/Product/GetProductsByCategory/${categoryId}`);
}

export const APIToGetProductDetailsById = async (
    productId: number): Promise<AxiosResponse> => {
    return await apiClient.get(`/Product/GetProductById/${productId}`);
}

export const APIToFetchUserCart = async (token: string): Promise<AxiosResponse> => {
    return await apiClient.get(`/Cart/GetCart`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const APIToGetUserDetails = async (token: string): Promise<AxiosResponse> => {
    return await apiClient.get(`/User/GetUserById`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const APIToGetWarehouseDetails = async (): Promise<AxiosResponse> => {
    return await apiClient.get(`/WarehouseMaster/GetAllWarehouse`);
}


export const APIToGetAllCountries = async (): Promise<AxiosResponse> => {
    return await apiClient.get(`/Country/GetCountries`);
}

export const APIToGetStatesByCountry = async (countryId: number): Promise<AxiosResponse> => {
    return await apiClient.get(`/State/GetStatesByCountry?countryId=${countryId}`);
}

export const APIToGetCitiesByState = async (stateId: number): Promise<AxiosResponse> => {
    return await apiClient.get(`/City/GetCitiesByState?stateId=${stateId}`);
}

export const APIToAddItemToCart = async (cart: CartReqBody[], token: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/Cart/AddToCart`, cart,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}


export const APIToCreateUser = async (userDetails: CreateUserReqBody): Promise<AxiosResponse> => {
    return await apiClient.post(`/User/CreateUser`, userDetails);
}

export const APIToUpdateUserDetails = async (userDetails: UpdateUserDetailsReqBody, token: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/User/UpdateUser`, userDetails,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
}

export const APIToUpdateCartItemQuantity = async (productId: string, quantity: number, token: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/Cart/UpdateItemQuantity`, { productId, quantity },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const APIToRemoveItemFromCart = async (productId: string, token: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/Cart/RemoveItem?productId=${productId}`, {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const APIToCreateOrder = async (orderDetail: CreateOrderPayload, token: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/Order/CreateOrder`, orderDetail,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const APIToCreateGuestUser = async (guestUserDetails: GuestUserDetails): Promise<AxiosResponse> => {
    return await apiClient.post(`/User/CreateGuestUser`, guestUserDetails);
}

export const APIToSendOTPForGuestUser = async (email: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/Login/guest-user-otp`, { email },);
}

export const APIToVerifyOTPForGuestUser = async (email: string, otp: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/Login/verify-guest-otp`, { email, otp });
}

export const APIToInitiateMpesaPayment = async (orderId: string, phoneNumber: string, token: string): Promise<AxiosResponse> => {
    return await apiClient.post(`/Mpesa/InitiatePayment`, { orderId, phoneNumber }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export const APIToCheckMpesaPaymentStatus = async (orderId: string, token: string): Promise<AxiosResponse> => {
    return await apiClient.get(`/Mpesa/TransactionByOrder/${orderId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}