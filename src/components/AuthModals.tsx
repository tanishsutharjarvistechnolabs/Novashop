"use client";

import { CreateUserReqBody, SignupData, SignupDataError } from "@/interfaces";
import { APIToCreateUser, APIToSendOtp, APIToVerifyOtp } from "@/lib/api/api.service";
import { EMAIL_REGEX, KENYA_PHONE_ERROR_MESSAGE, KENYA_PHONE_REGEX, KRA_PIN_REGEX, OTP_SEND_TYPE } from "@/lib/enum";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner'

export function AuthModals() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string>("");
  const { auth } = useAuthStore();
  const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    email: "",
    phone: "",
    claimVAT: false,
    companyName: "",
    PIN: "",
  });
  const [isSignupMode, setIsSignupMode] = useState<boolean>(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [signupFormErrors, setSignupFormErrors] = useState<SignupDataError>({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    PIN: "",
  });

  const [resendTimer, setResendTimer] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loginModal = document.getElementById("LoginModal");
    const signupModal = document.getElementById("SignupModal");
    const otpModal = document.getElementById("otpModal");

    const clearLoginErrors = () => {
      setEmailError("");
      setEmail("");
    };

    const clearSignupErrors = () => {
      if (!isSignupMode) {
        setSignupFormErrors({ name: "", email: "", phone: "", companyName: "", PIN: "" });
        setSignupData({ name: "", email: "", phone: "", claimVAT: false, companyName: "", PIN: "" });
      }
    };

    if (signupModal) signupModal.addEventListener("hidden.bs.modal", clearSignupErrors);

    return () => {
      if (loginModal) loginModal.removeEventListener("hidden.bs.modal", clearLoginErrors);
      if (signupModal) signupModal.removeEventListener("hidden.bs.modal", clearSignupErrors);
    };
  }, [isSignupMode]);

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

  const handleChange = (value: string, index: number) => {
    setOtpError("");

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    setOtpError("");
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (isFromSignup: boolean = false) => {
    if (!email && !isFromSignup) {
      setEmailError("Email is required");
      return;
    }

    if (!EMAIL_REGEX.test(email) && !isFromSignup) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    const otpEmail = isFromSignup ? signupData.email : email;

    try {
      const res = await APIToSendOtp(otpEmail, isFromSignup ? OTP_SEND_TYPE.REGISTER : OTP_SEND_TYPE.LOGIN);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;

      if (resData.status && resData.statusCode === 200) {
        toast.success(resData.message || "OTP sent successfully");
        setIsSignupMode(isFromSignup);
        if (!isFromSignup) {
          document.getElementById("closeSignInModel")?.click();
        } else {
          document.getElementById("closeSignUpModel")?.click();
        }
        setTimeout(() => {
          document.getElementById("openOtpTrigger")?.click();
        }, 10);
        startResendTimer();
      }

      if (!resData.status && resData.statusCode !== 200 && resData.message) {
        if (isFromSignup) {
          setSignupFormErrors((prev) => ({
            ...prev,
            email: resData.message || "Failed to send OTP. Please try again.",
          }));
        } else {
          setEmailError(resData.message || "Failed to send OTP. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (isFromSignup) {
        toast.error("Failed to send OTP. Please try again.");
      } else {
        setEmailError("Failed to send OTP. Please try again.");
        setEmail("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setOtpVerifying(true);

    const otpEmail = isSignupMode ? signupData.email : email;

    try {
      const res = await APIToVerifyOtp(otpEmail, finalOtp);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;

      if (resData.status && resData.statusCode === 200) {
        if (!isSignupMode) toast.success(resData.message || "OTP verified successfully");

        if (isSignupMode) {
          await handleCreateUserAfterOtp();
        } else {
          if (resData.data) auth.setAuthToken(resData.data);
          setOtp(Array(6).fill(""));
          document.getElementById("closeOTPModel")?.click();
          setEmail("");
          window.location.reload();
        }
      } else {
        toast.error(resData.message || "OTP verification failed");
        setOtp(Array(6).fill(""));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Failed to verify OTP. Please try again.");
      setOtp(Array(6).fill(""));
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleCreateUserAfterOtp = async () => {
    const reqBody: CreateUserReqBody = {
      FullName: signupData.name,
      email: signupData.email,
      contactNo: signupData.phone,
      ClaimVAT: signupData.claimVAT,
      CompanyName: signupData.claimVAT ? signupData.companyName : undefined,
      PersonalIdentificationNumber: signupData.claimVAT ? signupData.PIN : undefined,
    };

    try {
      const res = await APIToCreateUser(reqBody);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;


      if (resData.status && resData.statusCode === 200) {
        toast.success(resData.message || "Account created successfully");
        if (resData.data && resData.data.token) auth.setAuthToken(resData.data.token);

        setOtp(Array(6).fill(""));
        document.getElementById("closeOTPModel")?.click();

        setSignupData({
          name: "",
          email: "",
          phone: "",
          claimVAT: false,
          companyName: "",
          PIN: "",
        });
        setSignupFormErrors({
          name: "",
          email: "",
          phone: "",
          companyName: "",
          PIN: "",
        });
        setIsSignupMode(false);
      } else if (resData && resData.statusCode === 400 && resData.errors) {
        const apiErrors = resData.errors;
        const newFormErrors: SignupDataError = {
          name: apiErrors.FullName || "",
          phone: apiErrors.ContactNo || "",
          email: apiErrors.email || "",
          companyName: apiErrors.CompanyName || "",
          PIN: apiErrors.PersonalIdentificationNumber || "",
        }
        setSignupFormErrors(newFormErrors);
        document.getElementById("closeOTPModel")?.click();
        document.getElementById("openSignupTrigger")?.click();
        return null;
      }
      else {
        toast.error(resData.message || "Account creation failed. Please try again.");
        setOtpError(resData.message || "Failed to create account");
        setOtp(Array(6).fill(""));
        setIsSignupMode(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setOtpError("Failed to create account. Please try again.");
      toast.error("Failed to create account. Please try again.");
      setOtp(Array(6).fill(""));
      setIsSignupMode(false);
      auth.resetAuthToken();
    }
  };

  const handleSignupInputChange = (field: keyof SignupData, value: string | boolean) => {
    setSignupFormErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }



  const handleSignup = async () => {
    const errors: SignupDataError = {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      PIN: "",
    };

    if (!signupData.name) {
      errors.name = "Name is required";
    }

    if (!signupData.email) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(signupData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!signupData.phone) {
      errors.phone = "Phone number is required";
    } else if (!KENYA_PHONE_REGEX.test(signupData.phone)) {
      errors.phone = KENYA_PHONE_ERROR_MESSAGE;
    }

    if (signupData.claimVAT) {
      if (!signupData.companyName) {
        errors.companyName = "Company name is required for VAT claim";
      }
      if (!signupData.PIN) {
        errors.PIN = "PIN is required for VAT claim";
      } else {
        if (!KRA_PIN_REGEX.test(signupData.PIN)) {
          errors.PIN = "Invalid KRA PIN format (e.g. A123456789Z)";
        }
      }
    } else {
      errors.companyName = "";
      errors.PIN = "";
    }

    setSignupFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    await handleSendOtp(true);
  };

  const handleReSendOtp = async () => {
    setLoading(true);
    setOtpError("");
    if (resendTimer > 0) return;

    const otpEmail = isSignupMode ? signupData.email : email;

    try {
      const res = await APIToSendOtp(otpEmail, isSignupMode ? OTP_SEND_TYPE.REGISTER : OTP_SEND_TYPE.LOGIN);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;

      if (resData.status && resData.statusCode === 200) {
        toast.success(resData.message || "OTP sent successfully");
        startResendTimer();
      }

    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="modal fade"
        id="LoginModal"
        data-bs-backdrop="static"
        tabIndex={-1}
        aria-labelledby="LoginLabel"
        aria-hidden="true"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="LoginLabel">
                login
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" 
                onClick={() => {
                  setEmail("");
                  setEmailError("");
                }}
              />
            </div>
            <div className="modal-body">
              <div className="w-100">
                <p className="fw-400 mb-2">
                  Sign in to your account to continue, access your information, and manage your activity seamlessly.
                </p>
                <p>
                  <input className="form-control" type="text" placeholder="Enter Your Registered email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  {emailError && <span className="text-danger ms-2">{emailError}</span>}
                </p>
              </div>
            </div>
            <div className="modal-footer d-block">
              <button type="button" className="btn btn-blue"
                onClick={() => handleSendOtp(false)}
                disabled={loading}
              >
                Verify
              </button>
              <p className="text-center mt-3 mb-0">
                Already have an account?{" "}
                <a
                  className="color-blue fw-600 text-decoration-none"
                  data-bs-toggle="modal"
                  data-bs-target="#SignupModal"
                  data-bs-dismiss="modal"
                  role="button"
                  onClick={() => {
                    setEmail("");
                    setEmailError("");
                    setIsSignupMode(true);
                    setSignupFormErrors({ name: "", email: "", phone: "", companyName: "", PIN: "" });
                    setSignupData({ name: "", email: "", phone: "", claimVAT: false, companyName: "", PIN: "" });
                  }}
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="SignupModal"
        data-bs-backdrop="static"
        tabIndex={-1}
        aria-labelledby="SignupLabel"
        aria-hidden="true"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="SignupLabel">
                Signup
              </h5>
              <button id="closeSignUpModel" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="w-100">
                <p className="fw-400 mb-3">
                  Create an account to get started, save your details, and enjoy a smoother experience across your interactions.
                </p>
                <p className="mb-2">
                  <input className="form-control" type="text" placeholder="Enter Your Name"
                    value={signupData.name}
                    onChange={(e) => handleSignupInputChange("name", e.target.value)}
                  />
                  {signupFormErrors.name && <span className="text-danger ms-2">{signupFormErrors.name}</span>}
                </p>
                <p className="mb-2">
                  <input className="form-control" type="text" placeholder="Enter Your Email Addrss"
                    value={signupData.email}
                    onChange={(e) => handleSignupInputChange("email", e.target.value)}
                  />
                  {signupFormErrors.email && <span className="text-danger ms-2">{signupFormErrors.email}</span>}
                </p>
                <p className="mb-3">
                  <input className="form-control" type="text" placeholder="Enter Your Phone Number"
                    value={signupData.phone}
                    maxLength={15}
                    onChange={(e) => {
                      const value = e.target.value
                        ? e.target.value
                          .toString()
                          .replace(/[^\d+]/g, "")
                          .replace(/(?!^)\+/g, "")
                        : "";
                      handleSignupInputChange("phone", value)
                    }}
                  />
                  {signupFormErrors.phone && <span className="text-danger ms-2">{signupFormErrors.phone}</span>}
                </p>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                    checked={signupData.claimVAT}
                    onChange={(e) => handleSignupInputChange("claimVAT", e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    I would like to claim VAT
                  </label>
                </div>
                {signupData.claimVAT && (
                  <>
                    <p className="mb-2">
                      <input className="form-control" type="text" placeholder="Enter Your Company Name"
                        value={signupData.companyName}
                        onChange={(e) => handleSignupInputChange("companyName", e.target.value)}
                      />
                      {signupFormErrors.companyName && <span className="text-danger ms-2">{signupFormErrors.companyName}</span>}
                    </p>
                    <p className="mb-2">
                      <input className="form-control" type="text" placeholder="Enter Your PIN"
                        value={signupData.PIN}
                        onChange={(e) => handleSignupInputChange("PIN", e.target.value)}
                      />
                      {signupFormErrors.PIN && <span className="text-danger ms-2">{signupFormErrors.PIN}</span>}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer d-block">
              <button type="button" className="btn btn-blue"
                onClick={handleSignup}
              >
                Send OTP
              </button>
              <p className="text-center mt-3 mb-0">
                Already have an account?{" "}
                <a
                  className="color-blue fw-600 text-decoration-none"
                  data-bs-toggle="modal"
                  data-bs-target="#LoginModal"
                  data-bs-dismiss="modal"
                  role="button"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="otpModal"
        data-bs-backdrop="static"
        tabIndex={-1}
        aria-labelledby="otpLabel"
        aria-hidden="true"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="otpLabel">
                OTP
              </h5>
              <button type="button" id="closeOTPModel" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                onClick={() => {
                  setOtp(Array(6).fill(""));
                  setOtpError("");
                  if (!isSignupMode) {
                    setEmail("");
                  }
                  setEmailError("");
                  setResendTimer(0);
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                  }
                }}
              />
            </div>
            <div className="modal-body">
              <div className="w-100">
                <p className="fw-400 text-center mb-3">
                  Enter your OTP code here for verifying your email address
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
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      value={digit ? "•" : ""}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
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
                onClick={handleVerifyOtp}
                disabled={otpVerifying}>
                Verify
              </button>
            </div>
          </div>
        </div>
      </div >

      <button
        id="openOtpTrigger"
        className="d-none"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#otpModal"
      />
      <button
        id="closeSignInModel"
        className="d-none"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#LoginModal"
      />
      <button
        id="openLoginTrigger"
        className="d-none"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#LoginModal"
      />
      <button
        id="openSignupTrigger"
        className="d-none"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#SignupModal"
      />
    </>
  );
}
