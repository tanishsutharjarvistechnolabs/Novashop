"use client";

import { useCategoryStore } from "@/stores/categories-store";
import { useProductStore } from "@/stores/product-store";
import Link from "next/link";

export function Footer() {

  const { categories: productCategories } = useCategoryStore()
  const { products } = useProductStore()

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="linkWrapper">
              <div className="boxHldr">
                <div className="footerLogo mb-3">
                  <img src="/assets/images/logo-white.svg" alt="NOVASHOP" />
                </div>
                <p className="fs-16 fw-500">
                  A premier hospitality POS provider in Kenya and East Africa, operating since
                  1997 as a primary distributor of Oracle Hospitality solutions.
                </p>
              </div>

              <div className="boxHldr">
                <a className="contact-item" href="tel:+254202731000">
                  <i className="icon-mobile contact-icon" />
                  <span className="fw-500 fs-16 color-white">+254 20-273-1000</span>
                </a>
                <a
                  className="contact-item"
                  href="mailto:info@novacom.co.ke"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="icon-sms contact-icon" />
                  <span className="fw-500 fs-16 color-white">info@novacom.co.ke</span>
                </a>
              </div>

              <div className="boxHldr">
                <ul className="prolink">
                  <li className="title">Categories</li>
                  {productCategories.length === 0 ? (
                    <p className="fw-500 ms-1">No categories available</p>
                  ) : (
                    productCategories.slice(0, 5).map((category) => (
                      <li key={category.productCategoryID}>
                        <Link href={`/product?categoryId=${category.productCategoryID}`}>
                          {category.productCategoryName}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="boxHldr">
                <ul className="prolink">
                  <li className="title">Products</li>
                  {products.length === 0 ? (
                    <p className="fw-500 ms-1">No products available</p>
                  ) : (
                    products.slice(0, 5).map((product) => (
                      <li key={product.id}>
                        <Link href={`/product-details/${product.id}`}>
                          {product.name}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="boxHldr">
                <ul className="prolink">
                  <li className="title">Contact Info</li>
                  <li>200 MEBank Towers,</li>
                  <li>Milimani Road,</li>
                  <li>P.O Box 49076 GPO,</li>
                  <li>Nairobi - 00100,</li>
                  <li>Kenya</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12 mt-3">
            <div className="copyRightMain">
              <div className="copyRight">
                © novashop {new Date().getFullYear()} All Rights Reserved
              </div>

              {/* <div className="PolicyMain">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms and Conditions</a>
                <a href="#">Copyright Policy</a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
