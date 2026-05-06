"use client";

import { SectionBadge } from "@/components/SectionBadge";
import { SupportSection } from "@/components/SupportSection";
import { handleAddToCart } from "@/lib/shared";
import { formatKes, homePageData } from "@/lib/storefront-data";
import { useCategoryStore } from "@/stores/categories-store";
import { useProductStore } from "@/stores/product-store";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const { categories: productCategories } = useCategoryStore()
  const { products } = useProductStore()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const selectedCategory = productCategories.find(
    (category) => category.productCategoryID === selectedCategoryId
  );
  const visibleProducts = selectedCategoryId
    ? products.filter((product) => product.productCategoryID === selectedCategoryId)
    : products; 
  const featuredProducts = visibleProducts.slice(0, 8);

  return (
    <>
      <section className="bannerWrapper">
        <div className="hero-slider">
          <div>
            <div className="bannerTxt">
              <p className="fs-20 fw-600 color-white">{homePageData.heroSlides.eyebrow}</p>
              <h2 className="text-uppercase fw-600 color-white">{homePageData.heroSlides.title}</h2>
              <p className="fs-28 fw-600 color-white col-md-6">{homePageData.heroSlides.description}</p>
              <a href={homePageData.heroSlides.ctaHref} className="btn btn-white mt-4">
                <span>{homePageData.heroSlides.ctaLabel}</span>
                <i className="icon-dot fs-10"></i>
              </a>
            </div>
            <img src={homePageData.heroSlides.imageSrc} alt={homePageData.heroSlides.imageAlt} />
          </div>
        </div>
      </section>

      <section id="products" className="shop-layout-section py-100">
        <div className="container">
          <div className="shop-section-header">
            <div>
              <SectionBadge>{homePageData.servicesIntro.eyebrow}</SectionBadge>
              <h2 className="title fs-60 mb-3">
                {selectedCategory ? selectedCategory.productCategoryName : homePageData.servicesIntro.title}
              </h2>
              <p className="fs-18 fw-500">{homePageData.servicesIntro.description}</p>
            </div>
            {/* <Link href="/product" className="btn btn-blue">
              <span>View All Products</span> <i className="icon-dot fs-10"></i>
            </Link> */}
          </div>

          <div className="home-category-nav" aria-label="Product categories">
            <button
              type="button"
              className={selectedCategoryId === null ? "active" : ""}
              onClick={() => setSelectedCategoryId(null)}
            >
              All Categories
            </button>
            {productCategories.map((category) => (
              <button
                key={category.productCategoryID}
                type="button"
                className={selectedCategoryId === category.productCategoryID ? "active" : ""}
                onClick={() => setSelectedCategoryId(category.productCategoryID)}
              >
                {category.productCategoryName}
              </button>
            ))}
          </div>

          {!featuredProducts || featuredProducts.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "30vh" }}>
              <p className="text-muted fs-4 fw-500 m-0">No products available</p>
            </div>
          ) : (
            <div className="shop-product-grid">
              {featuredProducts.map((product) => (
                <article key={product.id} className="shop-product-card">
                  <Link
                    href={`/product-details/${product.id}`}
                    className="shop-product-image"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <img src={product.primaryImageUrl} alt={product.name} />
                  </Link>
                  <div className="shop-product-content">
                    <p className="shop-product-category">{product.productCategoryName}</p>
                    <h3 className="productTitle">
                      <Link
                        href={`/product-details/${product.id}`}
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="shop-product-description">{product.shortDescription}</p>
                    <strong className="product-price">{formatKes(product.itemRate || product.priceInKes || 0)}</strong>
                    <div className="shop-card-actions">
                      <Link
                        href={`/product-details/${product.id}`}
                        className="btn btn-blue-line"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <span>View Product</span>
                      </Link>
                      <button
                        className="btn btn-blue"
                        onClick={() => handleAddToCart(product)}
                      >
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* <section className="shop-layout-section gray-bg py-100">
        <div className="container">
          <div className="shop-section-header">
            <div>
              <SectionBadge>{homePageData.featuredIntro.eyebrow}</SectionBadge>
              <h2 className="title fs-60 mb-3">{homePageData.featuredIntro.title}</h2>
              <p className="fs-18 fw-500">{homePageData.featuredIntro.description}</p>
            </div>
          </div>

          {!productCategories || productCategories.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "30vh" }}>
              <p className="text-muted fs-4 fw-500 m-0">No Categories available</p>
            </div>
          ) : (
            <div className="shop-category-grid">
              {productCategories.map((service, index) => (
                <Link
                  key={service.productCategoryID}
                  href={`/product?categoryId=${service.productCategoryID}`}
                  className="shop-category-card"
                >
                  <span className="shop-category-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="shop-category-image">
                    <img src={service.categoryImageUrl} alt={service.productCategoryName} />
                  </div>
                  <div className="shop-category-content">
                    <h3 className="title fw-600 fs-26 mb-2">{service.productCategoryName}</h3>
                    <p className="fw-500 mb-0">{service.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section> */}

      <SupportSection />
    </>
  );
}
