"use client";

import { InnerBanner } from "@/components/InnerBanner";
import { SupportSection } from "@/components/SupportSection";
import { City, State, UserDetailsError, UserDetailsReqBody, type CheckoutPageContentProps, type Country, type UserDetails } from "@/interfaces";
import { CreateOrderPayload, GuestUserDetails, GuestUserResponse, WarehouseAddress } from "@/interfaces/payment/payment.interface";
import { APIToCheckMpesaPaymentStatus, APIToCreateGuestUser, APIToCreateOrder, APIToGetAllCountries, APIToGetCitiesByState, APIToGetStatesByCountry, APIToGetUserDetails, APIToGetWarehouseDetails, APIToInitiateMpesaPayment, APIToSendOTPForGuestUser, APIToVerifyOTPForGuestUser } from "@/lib/api/api.service";
import { DELIVERY_MODE, EMAIL_REGEX, KENYA_PHONE_ERROR_MESSAGE, KENYA_PHONE_REGEX, M_PESA_NUMBER_ERROR_MESSAGE, M_PESA_NUMBER_REGEX, PAYMENT_MODE, PAYMENT_STATUS, PHONE_REGEX } from "@/lib/enum";
import { formatKes } from "@/lib/storefront-data";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useLoaderStore } from "@/stores/useLoaderStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function activateOnKey(event: KeyboardEvent<HTMLElement>, callback: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

export function CheckoutPageContent({ data }: CheckoutPageContentProps) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout" }
  ];
  const [selectedDelivery, setSelectedDelivery] = useState(data.deliveryOptions[0] ? data.deliveryOptions[0].id : DELIVERY_MODE.COLLECTION);
  const [selectedPayment, setSelectedPayment] = useState(data.paymentOptions[0] ? data.paymentOptions[0].id : PAYMENT_MODE.ONLINE);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([]);
  const [warehouseAddress, setWarehouseAddress] = useState<WarehouseAddress | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserDetailsReqBody>({
    name: "",
    contactNo: "",
    email: "",
    streetAddress: "",
    cityId: null,
    countryId: null,
    stateId: null,
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState<UserDetailsError>({
    name: "",
    contactNo: "",
    email: "",
    streetAddress: "",
    cityId: "",
    countryId: "",
    stateId: "",
    zipCode: "",
  });

  const [mpesaNumber, setMpesaNumber] = useState<string>("");
  const [mpesaNumberError, setMpesaNumberError] = useState<string>("");

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState<string>("");
  const [guestToken, setGuestToken] = useState<string | null>(null);

  const { auth } = useAuthStore();

  const router = useRouter();

  const isLoggedIn = !!auth.authToken;
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const [resendTimer, setResendTimer] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const vatAmount = parseFloat((subtotal * data.vatRate).toFixed(2));
  const total = subtotal + vatAmount + (selectedDelivery === DELIVERY_MODE.DELIVERY ? data.deliveryFee : 0);
  const { setLoading: setGlobalLoader, setMessage: setLoaderMessage } = useLoaderStore();
  const [paymentError, setPaymentError] = useState<string>("");

  useEffect(() => {
    if (subtotal === 0) {
      router.push("/cart");
    }
  }, []);

  useEffect(() => {
    const fetchWarehouseAddress = async () => {
      try {
        const res = await APIToGetWarehouseDetails();
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        if (resData && resData.status && resData.statusCode === 200 && resData.data && resData.data.data && Array.isArray(resData.data.data) && resData.data.data.length > 0) {
          const warehouse = resData.data.data[0];
          setWarehouseAddress(warehouse);
        }
      } catch (err) {
        console.error("Error fetching warehouse address:", err);
      }
    }

    fetchWarehouseAddress();
  }, []);

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const res = await APIToGetAllCountries();
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        if (resData && resData.status && resData.statusCode === 200 && resData.data && resData.data.data && Array.isArray(resData.data.data)) {
          setCountries(resData.data.data);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    }

    fetchAllCountries();
  }, []);

  useEffect(() => {
    const fetchStateByCountries = async () => {
      try {
        const res = await APIToGetStatesByCountry(formData.countryId ?? 0);
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        if (resData && resData.status && resData.statusCode === 200 && resData.data && Array.isArray(resData.data)) {
          setStates(resData.data);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    }

    if (formData.countryId) {
      fetchStateByCountries();
    }
  }, [formData.countryId]);

  useEffect(() => {
    const fetchCitiesByState = async () => {
      try {
        const res = await APIToGetCitiesByState(formData.stateId ?? 0);
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        if (resData && resData.status && resData.statusCode === 200 && resData.data && Array.isArray(resData.data)) {
          setCities(resData.data);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    }

    if (formData.stateId) {
      fetchCitiesByState();
    }
  }, [formData.stateId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await APIToGetUserDetails(auth.authToken!);
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        if (resData && resData.status && resData.statusCode === 200 && resData.data) {
          setUserDetails(resData.data);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setUserDetails(null);
      }
    };

    if (auth.authToken) {
      fetchUserDetails();
    }
  }, [auth.authToken]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    const emailToUse = userDetails ? userDetails.email : formData.email;

    try {
      const res = await APIToVerifyOTPForGuestUser(emailToUse, finalOtp);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;

      if (resData.status && resData.statusCode === 200) {
        toast.success(resData.message || "OTP verified successfully");
        setOtp(Array(6).fill(""));
        const closeModalButton = document.getElementById("CloseGuestOTPModal");
        if (closeModalButton) {
          closeModalButton.click();
        }
        const tokenToUse = guestToken ?? auth.authToken;
        await CreateOrder(tokenToUse);
      } else {
        toast.error(resData.message || "OTP verification failed");
        return false;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Failed to verify OTP. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    setOtpError("");
    setLoading(true);
    try {
      const res = await APIToSendOTPForGuestUser(userDetails ? userDetails.email : formData.email);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;
      if (resData.status && resData.statusCode === 200) {
        toast.success(resData.message || "OTP sent successfully");
        const openModalButton = document.getElementById("OpenGuestOTPModal");
        startResendTimer();
        if (openModalButton) {
          openModalButton.click();
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleReSendOtp = async () => {
    setLoading(true);
    setOtpError("");
    if (resendTimer > 0) return;
    try {
      const res = await APIToSendOTPForGuestUser(userDetails ? userDetails.email : formData.email);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;

      if (resData.status && resData.statusCode === 200) {
        toast.success(resData.message || "OTP sent successfully");
        startResendTimer();
      }

    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleOTPChange = (value: string, index: number) => {
    setOtpError("");

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleGuestOTPKeyDown = (e: React.KeyboardEvent, index: number) => {
    setOtpError("");
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };


  const handleFormDataChange = (field: keyof UserDetailsReqBody, value: string | number | null) => {
    if (field === "contactNo") {
      value = value
        ? value
          .toString()
          .replace(/[^\d+]/g, "")
          .replace(/(?!^)\+/g, "")
        : "";
    }
    setFormErrors(prev => ({ ...prev, [field]: "" }));
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handlePlaceOrder = async () => {
    const errors: UserDetailsError = {
      name: formData.name ? "" : "Name is required",
      contactNo: !formData.contactNo
        ? "Contact number is required"
        : !PHONE_REGEX.test(formData.contactNo)
          ? "Invalid contact number"
          : !KENYA_PHONE_REGEX.test(formData.contactNo)
            ? KENYA_PHONE_ERROR_MESSAGE
            : "",
      email: formData.email ? EMAIL_REGEX.test(formData.email) ? "" : "Invalid email address" : "Email is required",
      cityId: !isLoggedIn && selectedDelivery === DELIVERY_MODE.DELIVERY ? formData.cityId ? "" : "City is required" : "",
      stateId: !isLoggedIn && selectedDelivery === DELIVERY_MODE.DELIVERY ? formData.stateId ? "" : "State is required" : "",
      countryId: !isLoggedIn && selectedDelivery === DELIVERY_MODE.DELIVERY ? formData.countryId ? "" : "Country is required" : "",
      streetAddress: !isLoggedIn && selectedDelivery === DELIVERY_MODE.DELIVERY ? formData.streetAddress ? "" : "Street address is required" : "",
      zipCode: !isLoggedIn && selectedDelivery === DELIVERY_MODE.DELIVERY ? formData.zipCode ? "" : "Zip code is required" : "",
    };

    let resolvedGuestToken: string | null = null;

    if (selectedPayment === PAYMENT_MODE.ONLINE || selectedDelivery === DELIVERY_MODE.DELIVERY) {
      if (!mpesaNumber) {
        setMpesaNumberError("M-Pesa number is required for online payment");
        return;
      } else if (!M_PESA_NUMBER_REGEX.test(mpesaNumber)) {
        setMpesaNumberError(M_PESA_NUMBER_ERROR_MESSAGE);
        return;
      }
    }

    if (selectedDelivery === DELIVERY_MODE.DELIVERY && isLoggedIn) {
      if (userDetails && (!userDetails.streetAddress || !userDetails.cityName || !userDetails.stateName || !userDetails.countryName)) {
        toast.error("Please update your profile with a complete address to proceed with delivery", {
          duration: 5000,
        });
        return;
      }
    }

    if (!isLoggedIn) {
      setFormErrors(errors);
      const hasErrors = Object.values(errors).some(error => error);

      if (hasErrors) {
        return;
      }

      const guestUserDetails: GuestUserDetails = {
        FullName: formData.name,
        contactNo: formData.contactNo,
        email: formData.email,
      }

      const createdGuestUser: GuestUserResponse | null = await APIForCreateGuestUser(guestUserDetails);
      if (createdGuestUser && createdGuestUser.guestUserToken) {
        resolvedGuestToken = createdGuestUser.guestUserToken;
        setGuestToken(resolvedGuestToken);
      } else {
        return;
      }
    }
    if (selectedPayment === PAYMENT_MODE.ON_COLLECTION && selectedDelivery === DELIVERY_MODE.COLLECTION) {
      await handleSendOtp();
      return;
    }

    await CreateOrder(resolvedGuestToken ?? auth.authToken!);
  }

  const APIForPlaceOrder = async (orderBody: CreateOrderPayload, token: string = auth.authToken): Promise<string | undefined> => {
    try {
      const res = await APIToCreateOrder(orderBody, token);
      if (!res || !res.data || (res.status !== 200 && res.status !== 201)) return;

      const resData = res.data;
      if (resData && resData.status && resData.statusCode === 201) {
        toast.success(resData.message || "Order placed successfully!");
        if (resData.data && resData.data.orderNumber) {
          setOrderNumber(resData.data.orderNumber);
          if (selectedPayment === PAYMENT_MODE.ON_COLLECTION && selectedDelivery === DELIVERY_MODE.COLLECTION) {
            const openModalButton = document.getElementById("OpenOrderSuccessModal");
            if (openModalButton) {
              openModalButton.click();
            }
            setTimeout(() => useCartStore.getState().clearCart(), 15000);
          }
          return resData.data.orderId;
        }
      }

      if (resData && resData.status && resData.statusCode !== 201) {
        toast.error(resData.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("An error occurred while placing your order. Please try again.");
    }
  }

  const APIForCreateGuestUser = async (guestUserDetails: GuestUserDetails): Promise<GuestUserResponse | null> => {
    try {
      const res = await APIToCreateGuestUser(guestUserDetails);
      if (!res || !res.data || res.status !== 200) return null;

      const resData = res.data;
      if (resData && resData.status && resData.statusCode === 200) {
        return resData.data;
      }
      if (resData && resData.statusCode === 400 && resData.errors) {
        const apiErrors = resData.errors;
        const newFormErrors: UserDetailsError = {
          name: apiErrors.FullName || "",
          contactNo: apiErrors.ContactNo || "",
          email: apiErrors.email || "",
          streetAddress: apiErrors.StreetAddress || "",
          cityId: apiErrors.cityId || "",
          stateId: apiErrors.stateId || "",
          countryId: apiErrors.countryId || "",
          zipCode: apiErrors.zipCode || "",
        }
        setFormErrors(newFormErrors);
        return null;
      }
      if (resData && resData.status && resData.statusCode !== 200) {
        toast.error(resData.message);
      }
    } catch (err) {
      console.error("Error creating guest user:", err);
    }
    return null;
  }

  const resetForm = () => {
    setFormData({
      name: "",
      contactNo: "",
      email: "",
      streetAddress: "",
      cityId: null,
      countryId: null,
      stateId: null,
      zipCode: "",
    });

    setFormErrors({
      name: "",
      contactNo: "",
      email: "",
      streetAddress: "",
      cityId: "",
      countryId: "",
      stateId: "",
      zipCode: "",
    });
    setMpesaNumber("");
    setMpesaNumberError("");

  }

  const CreateOrder = async (token: string) => {

    let deliveryAddress;

    if (selectedDelivery === DELIVERY_MODE.DELIVERY) {
      if (isLoggedIn && userDetails) {
        deliveryAddress = `${userDetails.streetAddress}, ${userDetails.cityName}, ${userDetails.stateName}, ${userDetails.countryName}`;
      } else if (formData.streetAddress) {
        const cityObj = cities.find((c) => c.cityId === formData.cityId);
        const stateObj = states.find((s) => s.stateId === formData.stateId);
        const countryObj = countries.find((c) => c.countryId === formData.countryId);

        deliveryAddress = `${formData.streetAddress}, ${cityObj ? cityObj.cityName : ""
          }, ${stateObj ? stateObj.stateName : ""
          }, ${countryObj ? countryObj.countryName : ""
          }, ${formData.zipCode}`;
      } else {
        deliveryAddress = undefined;
      }
    } else {
      deliveryAddress = undefined;
    }

    const orderBody: CreateOrderPayload = {
      paymentMode: selectedPayment,
      totalDiscount: 0,
      vatAmount,
      deliveryCharges:
        selectedDelivery === DELIVERY_MODE.DELIVERY ? data.deliveryFee : 0,
      deliveryMode: selectedDelivery,
      deliveryAddress: deliveryAddress,
      orderItems: items.map((item) => ({
        productId: Number(item.id),
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
      })),
    };

    const orderId = await APIForPlaceOrder(orderBody, token);

    if ((selectedPayment === PAYMENT_MODE.ONLINE || selectedDelivery === DELIVERY_MODE.DELIVERY) && orderId) {
      const resp = await APIToInitiatePayment(mpesaNumber, orderId, token);
      if (!resp) {
        return;
      }
    } else {
      return;
    }
  }

  const APIToInitiatePayment = async (mpesaNumber: string, orderId: string, token: string) => {
    setGlobalLoader(true);
    setLoaderMessage?.("M-Pesa payment initiated successfully! Please complete the payment...");
    try {
      const res = await APIToInitiateMpesaPayment(orderId, mpesaNumber, token);
      if (!res || !res.data || res.status !== 200) return false;

      const resData = res.data;
      if (resData && resData.status && resData.statusCode === 200) {
        toast.success("M-Pesa payment initiated successfully! Please complete the payment");
        setMpesaNumber("");
        if (resData.data && resData.data.checkoutRequestId && process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
          toast.info("Copy the M-Pesa checkout request ID: " + resData.data.checkoutRequestId, {
            duration: 15000,
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 20000));
        await pollPaymentStatus(orderId, token);
        return true;
      }

      if (resData && resData.statusCode === 400 && resData.errors) {
        const apiErrors = resData.errors;
        if (apiErrors.PhoneNumber) {
          setPaymentError(apiErrors.PhoneNumber || "Invalid M-Pesa number");
          document.getElementById("OpenOrderFailedModal")?.click();
        }
        setGlobalLoader(false);
        setLoaderMessage?.("");
        return false;
      }

      if (resData && !resData.status && resData.statusCode === 400) {
        setPaymentError(resData.message || "Failed to initiate M-Pesa payment. Please try again.");
        document.getElementById("OpenOrderFailedModal")?.click();
        setGlobalLoader(false);
        setLoaderMessage?.("");
        return false;
      }
      return false;
    } catch (err) {
      console.error("Error initiating M-Pesa payment:", err);
      toast.error("Failed to initiate M-Pesa payment. Please try again.");
      setGlobalLoader(false);
      setLoaderMessage?.("");
      return false;
    } finally {
      setGlobalLoader(false);
      setLoaderMessage?.("");
    }
  }

  const APIToVerifyPayment = async (orderId: string, token: string) => {
    setGlobalLoader(true);
    try {
      const res = await APIToCheckMpesaPaymentStatus(orderId, token);
      if (!res || !res.data || res.status !== 200) return false;

      const resData = res.data;

      if (resData && resData.status && resData.statusCode === 200) {
        if (resData.data && resData.data.status === PAYMENT_STATUS.COMPLETED) {
          return true;
        } else {
          return false;
        }
      } else {
        setGlobalLoader(false);
        setLoaderMessage?.("");
        return false;
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      toast.error("Payment verification failed. Please contact support.");
      setGlobalLoader(false);
      setLoaderMessage?.("");
      return false;
    }
  }

  const pollPaymentStatus = async (orderId: string, token: string) => {
    const MAX_ATTEMPTS = 5;
    const INTERVAL_MS = 10000;

    const messages = [
      "Waiting for payment confirmation...",
      "Checking with M-Pesa, please hold on...",
      "Almost there, verifying your payment...",
      "Still confirming, this won't take long...",
      "Finalizing your payment status...",
    ];

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      setLoaderMessage?.(messages[attempt - 1]);

      const verified = await APIToVerifyPayment(orderId, token);

      if (verified) {
        const openModalButton = document.getElementById("OpenOrderSuccessModal");
        if (openModalButton) {
          openModalButton.click();
        }
        setGlobalLoader(false);
        setLoaderMessage?.("");
        toast.success("Payment verified successfully! Your order is confirmed.");
        return;
      }

      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
      }
    }

    setGlobalLoader(false);
    setLoaderMessage?.("");
    const openModalButton = document.getElementById("OpenOrderFailedModal");
    if (openModalButton) {
      openModalButton.click();
    }
  };

  return (
    <>
      <InnerBanner
        title={data.banner.title}
        imageSrc={data.banner.imageSrc}
        imageAlt={data.banner.imageAlt}
        // breadcrumbs={breadcrumbs}
      />

      <section className="paymentMethodWrapper py-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="grayBox deliveryCollectionWrapper">
                <h2>DELIVERY &amp; COLLECTION SELECTION</h2>
                <div className="deliveryCollectionBody">
                  {data.deliveryOptions.map((option) => {
                    const isSelected = selectedDelivery === option.id;

                    return (
                      <div
                        key={option.id}
                        id={`opt-${option.id}`}
                        className={`delivery-option${isSelected ? " selected" : ""}`}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => {
                          setSelectedDelivery(option.id)
                          resetForm();
                        }}
                        onKeyDown={(event) => {
                          activateOnKey(event, () => setSelectedDelivery(option.id))
                        }}
                      >
                        <div className="radio-circle"></div>
                        <div className="option-content">
                          <div className="option-title">{option.title}</div>
                          <div className="option-desc">{option.description}</div>
                        </div>
                        <div className={`option-badge ${option.badgeClassName}`}>{option.badge}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              {selectedDelivery === DELIVERY_MODE.COLLECTION ? (
                <div className="grayBox paymentSelectWrapper">
                  <h2>PAYMENT SELECTION</h2>
                  <div className="paymentSelectBody">
                    <div className="pay-methods">
                      {data.paymentOptions.map((option) => {
                        const isSelected = selectedPayment === option.id;
                        return (
                          <div
                            key={option.id}
                            id={`pay-${option.id}`}
                            className={`pay-option${isSelected ? " selected" : ""}`}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSelected}
                            onClick={() => setSelectedPayment(option.id)}
                            onKeyDown={(event) => activateOnKey(event, () => setSelectedPayment(option.id))}
                          >
                            <div className="pay-option-title">{option.title}</div>
                            <div className="pay-option-desc">{option.description}</div>
                          </div>
                        );
                      })}
                    </div>

                    {!isLoggedIn && (
                      <div className="address-card">
                        <div className="address-label">Your details</div>
                        <div className="row">
                          <div className="row">
                            <div className="col-12 mb-3">
                              <input className={`form-control ${formErrors.name ? "error" : ""}`} type="text" placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => handleFormDataChange("name", e.target.value)}
                              />
                              {formErrors && formErrors.name && <div className="text-danger ms-2 mt-1">{formErrors.name}</div>}
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                              <input className={`form-control ${formErrors.contactNo ? "error" : ""}`} type="text" placeholder="Mobile"
                                value={formData.contactNo}
                                onChange={(e) => handleFormDataChange("contactNo", e.target.value)}
                                maxLength={15}
                              />
                              {formErrors && formErrors.contactNo && <div className="text-danger ms-2 mt-1">{formErrors.contactNo}</div>}
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                              <input className={`form-control ${formErrors.email ? "error" : ""}`} type="text" placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => handleFormDataChange("email", e.target.value)}
                              />
                              {formErrors && formErrors.email && <div className="text-danger ms-2 mt-1">{formErrors.email}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPayment !== PAYMENT_MODE.ONLINE && (
                      <div className="address-card">
                        <div className="address-label">{data.warehouseAddress.label}</div>
                        <div className="address-name">{warehouseAddress ? warehouseAddress.name : "Warehouse"}</div>
                        <div className="address-line">
                          {[
                            warehouseAddress && warehouseAddress.addressLine1,
                            warehouseAddress && warehouseAddress.addressLine2,
                            warehouseAddress && warehouseAddress.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                        <div className="address-map-link">
                          <a
                            href={
                              warehouseAddress
                                ? `https://www.google.com/maps?q=${warehouseAddress.latitude},${warehouseAddress.longitude}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-link"
                          >
                            <i className="fa-solid fa-map-marker-alt"
                              style={{ color: "black" }}
                            ></i>
                            <span className="mb-1">View Warehouse Location on Map</span>
                          </a>
                        </div>
                        <div className="address-phone">
                          <label>Mobile Number :</label>
                          <span>{warehouseAddress ? warehouseAddress.contactNumber : "N/A"}</span>
                        </div>
                      </div>
                    )}

                    {selectedPayment === PAYMENT_MODE.ONLINE && (
                      <div className="address-card">
                        <div className="address-label">M-Pesa Details</div>
                        <div className="row">
                          <div className="col-12 mb-3">
                            <input className={`form-control ${mpesaNumberError ? "error" : ""}`} type="text" placeholder="Enter M-Pesa registered phone number"
                              value={mpesaNumber}
                              onChange={(e) => {
                                setMpesaNumberError("");
                                setMpesaNumber(e.target.value.replace(/\D/g, ""))
                              }}
                            />
                            {mpesaNumberError && <div className="text-danger ms-2 mt-1">{mpesaNumberError}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="checkoutCartWrapper">
                      <div className="SubTotalWrapper">
                        <div className="tital-item">
                          <span className="fw-600">Subtotal</span>
                          <span className="fw-600">{formatKes(subtotal)}</span>
                        </div>
                        <div className="sub-title">
                          <span className="fw-400">VAT (16%)</span>
                          <span className="fw-400">{formatKes(vatAmount)}</span>
                        </div>
                        <div className="tital-item">
                          <hr />
                        </div>
                        <div className="tital-item">
                          <span className="fw-600">Total payable</span>
                          <span className="fw-600">{formatKes(total)}</span>
                        </div>
                        <div className="tital-item">
                          <button className="btn btn-blue"
                            onClick={handlePlaceOrder}
                            disabled={subtotal === 0}
                          >
                            <span>Place Order</span>
                          </button>
                        </div>
                        <div className="tital-item justify-content-center">
                          By placing your order you agree to the terms of sale.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grayBox paymentSelectWrapper">
                  <div className="paymentSelectBody">

                    {isLoggedIn && userDetails ? (
                      <div className="address-card">
                        <div className="address-label d-flex justify-content-between align-items-center">
                          <span>Delivery address</span>
                          <Link href="/profile" className="edit-link"><i className="fa-solid fa-pen-to-square"></i></Link>
                        </div>
                        <div className="address-name">
                          {userDetails.fullName}
                        </div>
                        <div className="address-line">{userDetails.streetAddress}</div>
                        <div className="address-line">
                          {userDetails.cityName} {userDetails.stateName ? `, ${userDetails.stateName}` : ""}
                        </div>
                        {userDetails.countryName && (
                          <div className="address-line">{userDetails.countryName}</div>
                        )}
                        <div className="address-phone">
                          <label>Mobile Number :</label>
                          <span>{userDetails.contactNo ?? "N/A"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="address-card">
                        <div className="address-label">Your details</div>
                        <div className="row">
                          <div className="col-12 mb-3">
                            <input className={`form-control ${formErrors.name ? "error" : ""}`} type="text" placeholder="Full name"
                              onChange={(e) => handleFormDataChange("name", e.target.value)}
                              value={formData.name}
                            />
                            {formErrors.name && <div className="text-danger ms-2 mt-1">{formErrors.name}</div>}
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                            <input
                              className={`form-control ${formErrors.contactNo ? "error" : ""}`}
                              type="tel"
                              value={formData.contactNo}
                              maxLength={15}
                              placeholder="Mobile"
                              onChange={(e) => {
                                const value = e.target.value
                                  ? e.target.value
                                    .toString()
                                    .replace(/[^\d+]/g, "")
                                    .replace(/(?!^)\+/g, "")
                                  : "";
                                handleFormDataChange("contactNo", value);
                              }}
                            />
                            {formErrors.contactNo && <div className="text-danger ms-2 mt-1">{formErrors.contactNo}</div>}
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                            <input className={`form-control ${formErrors.email ? "error" : ""}`} type="text" placeholder="Email Address"
                              onChange={(e) => handleFormDataChange("email", e.target.value)}
                              value={formData.email}
                            />
                            {formErrors.email && <div className="text-danger ms-2 mt-1">{formErrors.email}</div>}
                          </div>

                          <div className="col-12 mb-3">
                            <input className={`form-control ${formErrors.streetAddress ? "error" : ""}`} type="text" placeholder="Street address"
                              onChange={(e) => handleFormDataChange("streetAddress", e.target.value)}
                              value={formData.streetAddress}
                            />
                            {formErrors.streetAddress && <div className="text-danger ms-2 mt-1">{formErrors.streetAddress}</div>}
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                            <input className={`form-control ${formErrors.zipCode ? "error" : ""}`} type="text" placeholder="Postal / ZIP code"
                              onChange={(e) => handleFormDataChange("zipCode", e.target.value)}
                              value={formData.zipCode}
                            />
                            {formErrors.zipCode && <div className="text-danger ms-2 mt-1">{formErrors.zipCode}</div>}
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                            <Dropdown
                              value={formData.countryId || null}
                              options={countries.map((country) => ({ label: country.countryName, value: country.countryId }))}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, stateId: null, cityId: null }));
                                handleFormDataChange("countryId", e.value)
                              }}
                              placeholder="Select a country"
                              className={`w-100 primereact-dropdown ${formErrors.countryId ? "error" : ""}`}
                              panelClassName="primereact-dropdown-panel"
                              emptyMessage="No countries found"
                              itemTemplate={(option) => (
                                <div className="primereact-dropdown-item">
                                  <span >{option.label}</span>
                                </div>
                              )}
                              pt={{
                                wrapper: { "data-lenis-prevent-wheel": "true" },
                                emptyMessage: { className: "primereact-dropdown-item" },
                              }}
                            />
                            {formErrors.countryId && <div className="text-danger ms-2 mt-1">{formErrors.countryId}</div>}
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                            <Dropdown
                              value={formData.stateId || null}
                              disabled={!formData.countryId}
                              options={states.map((state) => ({ label: state.stateName, value: state.stateId }))}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, cityId: null }));
                                handleFormDataChange("stateId", e.value)
                              }}
                              placeholder="Select a state"
                              className={`w-100 primereact-dropdown ${formErrors.stateId ? "error" : ""}`}
                              panelClassName="primereact-dropdown-panel"
                              emptyMessage="No states found"
                              itemTemplate={(option) => (
                                <div className="primereact-dropdown-item">
                                  <span>{option.label}</span>
                                </div>
                              )}
                              pt={{
                                wrapper: { "data-lenis-prevent-wheel": "true" },
                                emptyMessage: { className: "primereact-dropdown-item" },
                              }}
                            />
                            {formErrors.stateId && <div className="text-danger ms-2 mt-1">{formErrors.stateId}</div>}
                          </div>

                          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                            <Dropdown
                              value={formData.cityId || null}
                              disabled={!formData.stateId}
                              options={cities.map((city) => ({ label: city.cityName, value: city.cityId }))}
                              onChange={(e) => handleFormDataChange("cityId", e.value)}
                              placeholder="Select a city"
                              className={`w-100 primereact-dropdown ${formErrors.cityId ? "error" : ""}`}
                              panelClassName="primereact-dropdown-panel"
                              emptyMessage="No cities found"
                              itemTemplate={(option) => (
                                <div className="primereact-dropdown-item">
                                  <span>{option.label}</span>
                                </div>
                              )}
                              pt={{
                                wrapper: { "data-lenis-prevent-wheel": "true" },
                                emptyMessage: { className: "primereact-dropdown-item" },
                              }}
                            />
                            {formErrors.cityId && <div className="text-danger ms-2 mt-1">{formErrors.cityId}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="address-card">
                      <div className="address-label">M-Pesa Details</div>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <input className={`form-control ${mpesaNumberError ? "error" : ""}`} type="text" placeholder="Enter M-Pesa registered phone number"
                            value={mpesaNumber}
                            onChange={(e) => {
                              setMpesaNumberError("");
                              const value = e.target.value
                                ? e.target.value
                                  .toString()
                                  .replace(/[^\d+]/g, "")
                                  .replace(/(?!^)\+/g, "")
                                : "";
                              setMpesaNumber(value);
                            }}
                          />
                          {mpesaNumberError && <div className="text-danger ms-2 mt-1">{mpesaNumberError}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="checkoutCartWrapper">
                      <div className="SubTotalWrapper">
                        <div className="tital-item">
                          <span className="fw-600">Subtotal</span>
                          <span className="fw-600">{formatKes(subtotal)}</span>
                        </div>
                        <div className="sub-title">
                          <span className="fw-400">VAT (16%)</span>
                          <span className="fw-400">{formatKes(vatAmount)}</span>
                        </div>
                        <div className="sub-title">
                          <span className="fw-400">Delivery fee</span>
                          <span className="fw-400">{formatKes(data.deliveryFee)}</span>
                        </div>
                        <div className="tital-item">
                          <hr />
                        </div>
                        <div className="tital-item">
                          <span className="fw-600">Total payable</span>
                          <span className="fw-600">{formatKes(total)}</span>
                        </div>
                        <div className="tital-item">
                          <button
                            className="btn btn-blue"
                            onClick={handlePlaceOrder}
                            disabled={subtotal === 0}
                          >
                            <span>Place Order</span>
                          </button>
                        </div>
                        <div className="tital-item justify-content-center">
                          By placing your order you agree to the terms of sale.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="OrderSuccessModal"
          data-bs-backdrop="static"
          tabIndex={-1}
          aria-labelledby="OrderSuccessLabel"
          aria-hidden="true"
          data-bs-keyboard="false"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="OrderSuccessLabel">
                  Order Placed Successfully
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  onClick={() => {
                    useCartStore.getState().clearCart();
                    setOrderNumber(null);
                    router.push("/#products");
                  }}
                />
              </div>
              <div className="modal-body">
                {selectedDelivery === DELIVERY_MODE.COLLECTION && selectedPayment === PAYMENT_MODE.ONLINE ? (
                  <p className="fw-400 mb-3">Your order has been placed and your payment has been received.</p>
                ) : (<p className="fw-400 mb-3">Your order has been placed successfully.</p>)}
                <p className="fw-400 mb-3">
                  Order ID: {orderNumber}
                </p>
                {selectedDelivery === DELIVERY_MODE.COLLECTION && warehouseAddress ? (
                  <>
                    {selectedDelivery === DELIVERY_MODE.COLLECTION && selectedPayment === PAYMENT_MODE.ONLINE ? (
                      <p className="fw-400 mb-3">You have selected warehouse collection.</p>) : (
                      <p className="fw-400 mb-3">You have chosen to pay at the time of collection.</p>
                    )
                    }

                    <div className="mb-3">
                      <p className="fw-600 mb-1">Warehouse Address:</p>
                      <p className="fw-400 mb-0">ABC Warehouse, Industrial Area, Enterprise Road, Nairobi, Kenya</p>
                    </div>

                    <div className="mb-3">
                      <p className="fw-600 mb-1">Map:</p>
                      <a href={
                        warehouseAddress ? `https://www.google.com/maps?q=${warehouseAddress.latitude},${warehouseAddress.longitude}`
                          : "#"
                      } target="_blank" rel="noopener noreferrer"
                        className="text-primary text-decoration-none">View Warehouse Location (Google Maps Link)</a>
                    </div>

                    <div className="mb-3">
                      <p className="fw-600 mb-1">Warehouse Hours:</p>
                      <p className="fw-400 mb-0">Monday to Friday, 11:00 AM – 7:00 PM</p>
                    </div>
                    {selectedDelivery === DELIVERY_MODE.COLLECTION && selectedPayment === PAYMENT_MODE.ONLINE ? (
                      <p className="fw-400 mb-0">
                        Please visit the warehouse at your convenience during the operational hours and present this Order ID to the person in charge to collect your order.
                      </p>) : (
                      <p className="fw-400 mb-0">
                        Please visit the warehouse during operational hours and present this Order ID to complete your payment and collect your order.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="fw-400 mb-3">Your order will be delivered to the following address:</p>

                    <div className="mb-3">
                      <p className="fw-600 mb-1">Delivery Address:</p>
                      <p className="fw-400 mb-0">
                        {userDetails && (
                          <>
                            {userDetails.fullName && <>{userDetails.fullName}<br /></>}
                            {userDetails.streetAddress}, {userDetails.cityName},{" "}
                            {userDetails.stateName}
                            {userDetails.countryName ? `, ${userDetails.countryName}` : ""}
                          </>
                        )}
                        {!isLoggedIn && (
                          <>
                            {formData.name && <>{formData.name}<br /></>}
                            {formData.streetAddress}, {cities.find(c => c.cityId === formData.cityId)?.cityName},{" "}
                            {states.find(s => s.stateId === formData.stateId)?.stateName}
                            {countries.find(c => c.countryId === formData.countryId)?.countryName ? `, ${countries.find(c => c.countryId === formData.countryId)?.countryName}` : ""}
                          </>
                        )}
                      </p>
                    </div>
                    <p className="fw-400 mb-0">
                      You will be notified once your order is dispatched.
                    </p>
                  </>
                )}
              </div>
              <div className="modal-footer d-block">
                <button type="button" className="btn btn-blue w-100" data-bs-dismiss="modal"
                  onClick={() => {
                    useCartStore.getState().clearCart();
                    setOrderNumber(null);
                    router.push("/#products");
                  }}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="GuestOTPModal"
          data-bs-backdrop="static"
          tabIndex={-1}
          aria-labelledby="GuestOTPModal"
          aria-hidden="true"
          data-bs-keyboard="false"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="otpLabel">
                  OTP
                </h5>
                <button type="button" id="CloseGuestOTPModal" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="w-100">
                  <p className="fw-400 text-center mb-3">
                    Please enter the OTP to complete your order. The code has been sent to your email address: {userDetails && userDetails.email ? userDetails.email : formData.email}
                  </p>
                  <div className="d-flex align-items-center d-grid gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        className="form-control text-center otp-dot"
                        type="text"
                        placeholder="X"
                        maxLength={1}
                        value={digit ? "•" : ""}
                        onChange={(e) => handleOTPChange(e.target.value, index)}
                        onKeyDown={(e) => handleGuestOTPKeyDown(e, index)}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-end">
                  {resendTimer > 0 ? (
                    <span className="text-muted mt-2 d-inline-block me-2">
                      Resend OTP in {resendTimer}s
                    </span>
                  ) : (
                    <a
                      className="fw-600 text-decoration-none mt-2 d-inline-block me-2"
                      onClick={handleReSendOtp}
                      role="button"
                      style={{ cursor: loading ? "not-allowed" : "pointer" }}
                    >
                      {loading ? "Sending..." : "Resend OTP"}
                    </a>
                  )}
                </div>
              </div>
              {
                otpError && <div className="text-danger text-center ms-2">{otpError}</div>
              }
              <div className="modal-footer d-block">
                <button type="button" className="btn btn-blue"
                  onClick={handleVerifyOtp}>
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="OrderFailedModal"
          data-bs-backdrop="static"
          tabIndex={-1}
          aria-labelledby="OrderFailedModal"
          data-bs-keyboard="false"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title text-danger">Payment Unsuccessful</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    useCartStore.getState().clearCart();
                    router.push("/");
                  }}
                />
              </div>

              {paymentError && (
                <div className="alert alert-danger m-3" role="alert">
                  {paymentError}
                </div>
              )}

              <div className="modal-body">
                <p className="mb-3">
                  Unfortunately, your transaction was not successful. Please verify your payment details and try again. If the issue persists, feel free to contact our support team for assistance.
                </p>
                <p className="fw-400 mb-3">
                  Order ID: {orderNumber}
                </p>
              </div>
              <div className="modal-body text-center">
                <a href="https://novacom.co.ke/contact-us/" className="text-primary text-decoration-none" target="_blank" rel="noopener noreferrer">
                  Contact Support
                </a>
              </div>



              <div className="modal-footer d-block">
                <button
                  type="button"
                  className="btn btn-blue w-100"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    useCartStore.getState().clearCart();
                    router.push("/");
                  }}
                >
                  GO TO HOME
                </button>
              </div>

            </div>
          </div>
        </div>
        <button
          id="OpenOrderSuccessModal"
          className="d-none"
          data-bs-dismiss="modal"
          data-bs-toggle="modal"
          data-bs-target="#OrderSuccessModal"
        />
        <button
          id="OpenGuestOTPModal"
          className="d-none"
          data-bs-toggle="modal"
          data-bs-dismiss="modal"
          data-bs-target="#GuestOTPModal"
        />
        <button
          id="OpenOrderFailedModal"
          className="d-none"
          data-bs-toggle="modal"
          data-bs-dismiss="modal"
          data-bs-target="#OrderFailedModal"
        />
      </section >
      {/* <SupportSection /> */}
    </>
  );
}
