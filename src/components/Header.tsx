"use client";

import { APIToGeneratePublicToken } from "@/lib/api/api.service";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useCategoryStore } from "@/stores/categories-store";
import { useProductStore } from "@/stores/product-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Header() {
  const { auth } = useAuthStore();

  const router = useRouter();

  const isLoggedIn = !!auth.authToken;

  const { categories: productCategories, fetchCategories } = useCategoryStore()
  const { products, fetchAllProduct } = useProductStore()

  useEffect(() => {
    if (productCategories.length === 0) {
      fetchCategories()
    }
  }, [])

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProduct()
    }
  }, [])


  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleLogout = () => {
    auth.resetAuthToken();
    router.push("/");
    // window.location.reload();
  };

  useEffect(() => {
    let isActive = true;
    if (auth.accessToken) return;
    const generatePublicToken = async () => {
      try {
        const res = await APIToGeneratePublicToken();
        if (!res || !res.data || res.status !== 200 || !isActive) return;

        const resData = res.data;

        if (resData.data && resData.status && resData.statusCode === 200 && resData.data.accessToken) {
          auth.setAccessToken(resData.data.accessToken);
        }
      } catch (err) {
        if (isActive) {
          console.error("Error generating public token:", err);
          toast.error("Error generating public token. Please try again.");
        }
      }
    }

    generatePublicToken();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !auth.authToken) return;

    const syncCart = async () => {
      await useCartStore.getState().syncWithServer(auth.authToken);
    };

    syncCart();
  }, [isLoggedIn, auth.authToken]);

  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

  return (
    <>
      <header>
        <div className="container-fluid">
          <div className="col-12">
            <div className="header-inner">
              <Link href="/" className="logo" aria-label="NOVASHOP home">
                <img src="/assets/images/logo.svg" alt="NOVASHOP" />
              </Link>

              <nav>
                <Link href="/" className="nav-link">
                  Home
                </Link>
                <a href="https://novacom.co.ke/about-us/" className="nav-link" target="_blank" >
                  About Us
                </a>

                <div className="nav-link has-dropdown">
                  Products <span className="chevron" />
                  <div className="dropdown">
                    {productCategories.length === 0 ? (
                      <p className="text-muted fw-500 ms-1">No categories available</p>
                    ) : (
                      productCategories.map((category) => (
                        <Link key={category.productCategoryID} href={{
                          pathname: "/",
                          query: { categoryId: category.productCategoryID },
                        }} className="dropdown-link">
                          {category.productCategoryName}
                        </Link>
                      ))
                    )}
                  </div>
                </div>

                <a href="https://novacom.co.ke/contact-us/" className="nav-link" target="_blank">
                  Contact Us
                </a>
              </nav>

              <div className="nav-icons">
                {/* <button
                  className="icon-btn"
                  type="button"
                >
                  <i className="icon-search" />
                </button> */}

                {/* {isLoggedIn ? (
                  <button
                    className="icon-btn"
                    aria-label="Logout"
                    type="button"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="icon-btn"
                    aria-label="Account"
                    data-bs-toggle="modal"
                    data-bs-target="#LoginModal"
                    type="button"
                  >
                    <i className="icon-user" />
                  </button>
                )} */}

                <div className="nav-link has-dropdown" style={{ position: "relative" }}>
                  <button className="icon-btn" aria-label="Account" type="button">
                    <i className="icon-user" />
                  </button>
                  <div className="dropdown">
                    {mounted && isLoggedIn ? (
                      <>
                        <Link href="/profile" className="dropdown-link">
                          Profile
                        </Link>
                        <a
                          className="dropdown-link"
                          type="button"
                          onClick={handleLogout}
                          style={{ textAlign: "left", width: "100%", background: "none", border: "none" }}
                        >
                          Logout
                        </a>
                      </>
                    ) : (
                      <a
                        className="dropdown-link"
                        data-bs-toggle="modal"
                        data-bs-target="#LoginModal"
                        type="button"
                      >
                        Login
                      </a>
                    )}
                  </div>
                </div>

                <div className="cart-wrap">
                  <Link className="icon-btn" aria-label="Cart" href="/cart">
                    <i className="icon-cart-bag" />
                  </Link>
                  <span className="cart-badge">{mounted ? cartItemCount : 0}</span>
                </div>
              </div>

              <button
                className="hamburger"
                id="hamburger"
                aria-label="Toggle menu"
                type="button"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobileMenu">
        <Link href="/" className="mobile-link">
          Home
        </Link>
        <a href="https://novacom.co.ke/about-us/" className="mobile-link" target="_blank">
          About Us
        </a>

        <button className="mobile-accordion-btn" id="productsAccordionBtn" type="button">
          Products <span className="chevron-icon" />
        </button>
        <div className="mobile-accordion-body" id="productsAccordionBody">
          {productCategories.length === 0 ? (
            <p className="text-muted fs-4 fw-500">No categories available</p>
          ) : (
            productCategories.map((category) => (
              <Link key={category.productCategoryID} href={{
                pathname: "/product",
                query: { categoryId: category.productCategoryID },
              }} className="mobile-link">
                {category.productCategoryName}
              </Link>
            ))
          )}
        </div>

        <a href="https://novacom.co.ke/contact-us/" className="mobile-link" target="_blank">
          Contact Us
        </a>
      </div>
    </>
  );
}
