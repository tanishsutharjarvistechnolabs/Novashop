"use client";

import { InnerBanner } from "@/components/InnerBanner";
import { SupportSection } from "@/components/SupportSection";
import { City, Country, State, UpdateUserDetailsReqBody, UserDetails, UserDetailsError, UserDetailsReqBody } from "@/interfaces";
import { APIToGetAllCountries, APIToGetCitiesByState, APIToGetStatesByCountry, APIToGetUserDetails, APIToUpdateUserDetails } from "@/lib/api/api.service";
import { EMAIL_REGEX, KENYA_PHONE_ERROR_MESSAGE, KENYA_PHONE_REGEX, KRA_PIN_REGEX, PHONE_REGEX } from "@/lib/enum";
import { profilePageData } from "@/lib/storefront-data";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { auth } = useAuthStore();
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const [formData, setFormData] = useState<UserDetailsReqBody>({
    name: "",
    contactNo: "",
    email: "",
    streetAddress: "",
    cityId: null,
    countryId: null,
    stateId: null,
    personal_Identification_Number: "",
    companyName: "",
    claimVAT: false,
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
    personal_Identification_Number: "",
    companyName: "",
    zipCode: "",
  });

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Profile" }
  ];

  useEffect(() => {
    if (userDetails) {
      setFormData({
        name: userDetails.fullName ?? "",
        contactNo: userDetails.contactNo ?? "",
        email: userDetails.email ?? "",
        streetAddress: userDetails.streetAddress ?? "",
        countryId: userDetails.countryId ?? null,
        stateId: userDetails.stateId ?? null,
        cityId: userDetails.cityId ?? null,
        personal_Identification_Number: userDetails.personal_Identification_Number ?? "",
        claimVAT: userDetails.claimVAT ?? false,
        companyName: userDetails.companyName ?? "",
        zipCode: userDetails.zipcode ?? "",
      });
    }
  }, [userDetails]);

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

    if (formData.countryId || formData.stateId) {
      fetchStateByCountries();
    }
  }, [formData.countryId, formData.stateId]);

  useEffect(() => {
    const fetchCitiesByState = async () => {
      try {
        const res = await APIToGetCitiesByState(formData.stateId ?? 0);
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        console.log("Cities response data:", resData);
        if (resData && resData.status && resData.statusCode === 200 && resData.data && Array.isArray(resData.data)) {
          setCities(resData.data);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    }

    if (formData.stateId || formData.cityId) {
      fetchCitiesByState();
    }
  }, [formData.stateId, formData.cityId]);

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
      }
    };

    if (auth.authToken) {
      fetchUserDetails();
    } else {
      setUserDetails(null);
      router.push("/");
    }
  }, [auth.authToken]);

  const handleFormDataChange = (field: keyof UserDetailsReqBody, value: string | number | null | boolean) => {
    setFormErrors(prev => ({ ...prev, [field]: "" }));
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handleFormSubmit = async () => {
    const errors: UserDetailsError = {
      name: "",
      contactNo: "",
      email: "",
      streetAddress: "",
      cityId: "",
      stateId: "",
      countryId: "",
      personal_Identification_Number: "",
      companyName: "",
      zipCode: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.streetAddress.trim()) {
      errors.streetAddress = "Street address is required.";
    }

    if (!formData.contactNo.trim()) {
      errors.contactNo = "Contact number is required.";
    } else if (!PHONE_REGEX.test(formData.contactNo)) {
      errors.contactNo = "Invalid contact number format.";
    } else if (!KENYA_PHONE_REGEX.test(formData.contactNo)) {
      errors.contactNo = KENYA_PHONE_ERROR_MESSAGE;
    }

    if (!formData.countryId) {
      errors.countryId = "Country is required.";
    }

    if (!formData.stateId) {
      errors.stateId = "State is required.";
    }

    if (!formData.cityId) {
      errors.cityId = "City is required.";
    }

    if (!formData.zipCode || !formData.zipCode.trim()) {
      errors.zipCode = "ZIP code is required.";
    } else if (formData.zipCode && formData.zipCode.length > 10) {
      errors.zipCode = "ZIP code cannot exceed 10 characters.";
    }

    if (formData.claimVAT) {
      if (!formData.companyName || !formData.companyName.trim()) {
        errors.companyName = "Company name is required to claim VAT.";
      }

      if (!formData.personal_Identification_Number || !formData.personal_Identification_Number.trim()) {
        errors.personal_Identification_Number = "Personal Identification Number is required to claim VAT.";
      }
      else if (formData.personal_Identification_Number && !KRA_PIN_REGEX.test(formData.personal_Identification_Number)) {
        errors.personal_Identification_Number = "Invalid KRA PIN format (e.g. A123456789Z)";
      }
    }

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some(error => error !== "");

    if (hasErrors) {
      return;
    }

    const reqBody: UpdateUserDetailsReqBody = {
      FullName: formData.name,
      contactNo: formData.contactNo,
      streetAddress: formData.streetAddress,
      PersonalIdentificationNumber: formData.personal_Identification_Number,
      cityId: formData.cityId,
      stateId: formData.stateId,
      countryId: formData.countryId,
      companyName: formData.companyName,
      claimVAT: formData.claimVAT,
      zipCode: formData.zipCode,
    }

    try {
      const res = await APIToUpdateUserDetails(reqBody, auth.authToken!);
      if (!res || !res.data || res.status !== 200) return;

      const resData = res.data;
      if (resData && resData.status && resData.statusCode === 200) {
        setIsEditMode(false);
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
          personal_Identification_Number: apiErrors.PersonalIdentificationNumber || "",
          companyName: apiErrors.CompanyName || "",
          zipCode: apiErrors.ZipCode || "",
        }

        setFormErrors(newFormErrors);
      }
    } catch (err) {
      console.error("Error updating user details:", err);
    }

  }

  return (
    <>
      <InnerBanner
        title={profilePageData.banner.title}
        imageSrc={profilePageData.banner.imageSrc}
        imageAlt={profilePageData.banner.imageAlt}
        breadcrumbs={breadcrumbs}
      />

      <section className="paymentMethodWrapper py-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="grayBox profileWrapper">
                <div className="profileHldr">
                  <div className="nameEmail">
                    <span className="userImg">
                      <i className="icon-user"></i>
                    </span>
                    <div className="nameMain">
                      <p className="fs-22 fw-600">{formData.name}</p>
                      <p> {formData.email}</p>
                    </div>
                  </div>
                  <div className="editBtn">
                    <button className="btn btn-blue"
                      onClick={() => {
                        setIsEditMode(prev => !prev)
                        setFormData({
                          name: userDetails?.fullName ?? "",
                          contactNo: userDetails?.contactNo ?? "",
                          email: userDetails?.email ?? "",
                          streetAddress: userDetails?.streetAddress ?? "",
                          cityId: userDetails?.cityId ?? null,
                          countryId: userDetails?.countryId ?? null,
                          stateId: userDetails?.stateId ?? null,
                          personal_Identification_Number: userDetails?.personal_Identification_Number ?? "",
                          claimVAT: userDetails?.claimVAT ?? false,
                          companyName: userDetails?.companyName ?? "",
                          zipCode: userDetails?.zipcode ?? "",
                        })

                        setFormErrors({
                          name: "",
                          contactNo: "",
                          email: "",
                          streetAddress: "",
                          cityId: "",
                          stateId: "",
                          countryId: "",
                          personal_Identification_Number: "",
                          companyName: "",
                          zipCode: "",
                        })

                      }}
                    >
                      {isEditMode ? "Cancel" : "Edit"}
                    </button>
                  </div>
                </div>
                <h3 className="titleMain">Your details</h3>
                <div className="row">
                  <div className="col-12 mb-3">
                    <input className="form-control" type="text" value={formData.name}
                      onChange={(e) => handleFormDataChange("name", e.target.value)} placeholder="Full Name"
                      readOnly={!isEditMode}
                    />
                    {isEditMode && formErrors.name && <div className="text-danger ms-2 mt-1">{formErrors.name}</div>}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                    <input className="form-control" type="text" value={formData.contactNo} placeholder="Mobile"
                      onChange={(e) => {
                        const value = e.target.value
                          ? e.target.value
                            .toString()
                            .replace(/[^\d+]/g, "")
                            .replace(/(?!^)\+/g, "")
                          : "";
                        handleFormDataChange("contactNo", value)
                      }}
                      readOnly={!isEditMode}
                      maxLength={15}
                    />
                    {isEditMode && formErrors.contactNo && <div className="text-danger ms-2 mt-1">{formErrors.contactNo}</div>}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                    <input className="form-control" type="text" value={formData.email} placeholder="Email"
                      onChange={(e) => handleFormDataChange("email", e.target.value)}
                      readOnly
                    />
                    {isEditMode && formErrors.email && <div className="text-danger ms-2 mt-1">{formErrors.email}</div>}
                  </div>
                  <div className="col-12 mb-3">
                    <input className="form-control" type="text" value={formData.streetAddress} placeholder="Street Address"
                      onChange={(e) => handleFormDataChange("streetAddress", e.target.value)}
                      readOnly={!isEditMode}
                    />
                    {isEditMode && formErrors.streetAddress && <div className="text-danger ms-2 mt-1">{formErrors.streetAddress}</div>}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                    <input className="form-control" type="text" value={formData.zipCode ?? ""}
                      placeholder="Postal / ZIP code" onChange={(e) => handleFormDataChange("zipCode", e.target.value)}
                      readOnly={!isEditMode}
                    />
                    {isEditMode && formErrors.zipCode && <div className="text-danger ms-2 mt-1">{formErrors.zipCode}</div>}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                    <Dropdown
                      value={formData.countryId || null}
                      disabled={!isEditMode}
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
                    {isEditMode && formErrors.countryId && <div className="text-danger ms-2 mt-1">{formErrors.countryId}</div>}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                    <Dropdown
                      value={formData.stateId || null}
                      disabled={!formData.countryId || !isEditMode}
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
                    {isEditMode && formErrors.stateId && <div className="text-danger ms-2 mt-1">{formErrors.stateId}</div>}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                    <Dropdown
                      value={formData.cityId || null}
                      disabled={!formData.stateId || !isEditMode}
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
                    {isEditMode && formErrors.cityId && <div className="text-danger ms-2 mt-1">{formErrors.cityId}</div>}
                  </div>
                  <div className="form-check mb-3 ms-3">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                      checked={formData.claimVAT ?? false}
                      onChange={(e) => handleFormDataChange("claimVAT", e.target.checked)}
                      disabled={!isEditMode}
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      I would like to claim VAT
                    </label>
                  </div>
                  {formData.claimVAT && (
                    <>
                      <p className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                        <input className="form-control" type="text" placeholder="Enter Your Company Name"
                          value={formData.companyName ?? ""}
                          onChange={(e) => handleFormDataChange("companyName", e.target.value)}
                          readOnly={!isEditMode}
                        />
                        {isEditMode && formErrors.companyName && <span className="text-danger ms-2 mt-1">{formErrors.companyName}</span>}
                      </p>
                      <p className="col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                        <input className="form-control" type="text" placeholder="Enter Your PIN"
                          value={formData.personal_Identification_Number ?? ""}
                          onChange={(e) => handleFormDataChange("personal_Identification_Number", e.target.value)}
                          readOnly={!isEditMode}
                        />
                        {isEditMode && formErrors.personal_Identification_Number && <span className="text-danger ms-2 mt-1">{formErrors.personal_Identification_Number}</span>}
                      </p>
                    </>)}
                  {isEditMode && (
                    <div className="col-12 mb-3">
                      <button className="btn btn-blue"
                        onClick={handleFormSubmit}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SupportSection />
    </>
  );
}
