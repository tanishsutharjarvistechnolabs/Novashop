export const PAYMENT_MODE = {
    ONLINE: 1,
    ON_COLLECTION: 2
};

export const DELIVERY_MODE = {
    COLLECTION: 1,
    DELIVERY: 2
};

export const PAYMENT_STATUS = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed"
};

export const OTP_SEND_TYPE = {
    REGISTER: 1,
    LOGIN: 3
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const KRA_PIN_REGEX = /^[A-Z][0-9]{9}[A-Z]$/;

export const PHONE_REGEX = /^\+?[0-9]{7,15}$/

export const CARD_EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;

export const KENYA_PHONE_REGEX = /^(?:254|\+254|0)?(7|1)\d{8}$/;

export const KENYA_PHONE_ERROR_MESSAGE = "Invalid Kenya phone number. Format should be 07xxxxxxxx, 01xxxxxxxx, 254xxxxxxxxx or +254xxxxxxxxx.";

export const M_PESA_NUMBER_REGEX = /^(?:\+254|254)(7|1)\d{8}$/;

export const M_PESA_NUMBER_ERROR_MESSAGE = "Enter a valid Safaricom number starting with +2547, +2541, 2547, or 2541. It must be exactly 12 digits (e.g., +254712345678 or 254712345678).";