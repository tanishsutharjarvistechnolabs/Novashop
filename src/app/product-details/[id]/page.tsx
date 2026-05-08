"use client";

import { QuantitySelector } from "@/components/QuantitySelector";
import { Product } from "@/interfaces";
import { APIToGetProductDetailsById } from "@/lib/api/api.service";
import { handleAddToCart } from "@/lib/shared";
import { formatKes, productDetailsPageData } from "@/lib/storefront-data";
import { useCategoryStore } from "@/stores/categories-store";
import { useProductStore } from "@/stores/product-store";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";


export default function ProductDetailsPage() {
  // const [descriptionTab, additionalInfoTab] = productDetailsPageData.tabs;
  const params = useParams();
  const productId = params.id;
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "delivery">("description");
  const { products, fetchAllProduct } = useProductStore();
  const { categories: productCategories } = useCategoryStore();
  const router = useRouter();


  useEffect(() => {
    if (products.length === 0) {
      fetchAllProduct();
    }
  }, [fetchAllProduct, products.length]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await APIToGetProductDetailsById(Number(productId));
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        if (resData && resData.status && resData.statusCode === 200 && resData.data) {
          setProductDetails(resData.data);
        }
      } catch (error) {
        console.error("Error fetching product details for product ID", productId, error);
      }
    }

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const gallery: string[] = productDetails
    ? [
      productDetails.primaryImageUrl,
      ...(productDetails.additionalImages ?? []).map((img) => img.imageUrl),
    ].filter((url): url is string => Boolean(url))
    : [];
  const displayedImageIndex =
    gallery.length > 0 && activeIndex < gallery.length ? activeIndex : 0;
  const relatedProducts = useMemo(() => {
    if (!productDetails) {
      return [];
    }

    const seededRank = (id: number) => (id * 9301 + productDetails.id * 49297) % 233280;

    return [...products]
      .filter((product) => product.id !== productDetails.id)
      .sort((a, b) => seededRank(a.id) - seededRank(b.id))
      .slice(0, 4);
  }, [productDetails, products]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/" },
    { label: productDetails ? productDetails.name : "Product Details" },
  ]

  return (
    <>
      <section className="home-category-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="home-category-nav" aria-label="Product categories">
                <Link
                  href="/"
                  className={!productDetails ? "active" : ""}
                >
                  All Categories
                </Link>
                {productCategories.map((category) => (
                  <Link
                    key={category.productCategoryID}
                    href={{
                      pathname: "/",
                      query: { categoryId: category.productCategoryID },
                    }}
                    className={productDetails?.productCategoryID === category.productCategoryID ? "active" : ""}
                  >
                    {category.productCategoryName}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {productDetails && (
        <>
          {/* <InnerBanner
            title={productDetails.productCategoryName}
            imageSrc={productDetails.primaryImageUrl}
            imageAlt={productDetails.name}

          /> */}
          <section className="productDetailWrapper py-4">
            <div className="container">
              <div className="product-detail-home-action">
                <Link href="/" className="btn btn-blue-line">
                  <span>Back to Products</span> <i className="icon-dot fs-10"></i>
                </Link>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                  <div className="productDetail-slider-main">
                    <div className="product-slider-for productBigImgHldr">
                      {gallery.length > 0 && gallery[displayedImageIndex] && (
                        <div className="product-item-big">
                          <img
                            key={gallery[displayedImageIndex]}
                            src={gallery[displayedImageIndex]}
                            alt={`${productDetails.name} image ${displayedImageIndex + 1}`}
                          />
                        </div>
                      )}
                    </div>

                    <div className="product-slider-nav productsmallImgHldr">
                      {gallery.map((imageSrc, index) => (
                        <div
                          key={imageSrc}
                          className={`product-item-small${index === displayedImageIndex ? " active" : ""}`}
                          onClick={() => setActiveIndex(index)}
                        >
                          <img
                            src={imageSrc}
                            alt={`${productDetails.name} thumbnail ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                  <div className="product-info-wrapper">
                    {breadcrumbs && breadcrumbs.length > 0 && (
                      <nav className="breadcrumb">
                        <ol className="breadcrumb__list">
                          {breadcrumbs.map((item, index) => (
                            <li key={index} className="breadcrumb__item">
                              {item.href ? (
                                <Link href={item.href} className="breadcrumb__link">
                                  {item.label}
                                </Link>
                              ) : (
                                <span className="breadcrumb__link">{item.label}</span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </nav>
                    )}
                    <h1 className="title fs-50 mb-2">{productDetails.name}</h1>
                    <div className="wp-sku-categories">
                      <span className="sku">SKU: {productDetails.itemCode}</span>
                    </div>
                    <div className="price-list mb-4">{productDetails.itemRate ? formatKes(productDetails.itemRate) : productDetails.priceInKes ? formatKes(productDetails.priceInKes) : "Price not available"}</div>
                    <div className="wp-sku-categories">
                      <span className="inventory">{productDetailsPageData.inventory}</span>
                    </div>
                    <div className="product-description">
                      <p>{productDetails.shortDescription}</p>
                    </div>
                    <div className="quantity_wrapper">
                      <span className="fs-20 fw-700 pe-2">Quantity</span>
                      <QuantitySelector defaultValue={1}
                        onChange={(newQty) => setQuantity(newQty)}
                      />
                    </div>
                    <div className="quantity_wrapper">
                      <button className="btn btn-blue"
                        onClick={() => {
                          handleAddToCart(productDetails, quantity);
                        }}
                      >
                        <span>Add to Cart</span> <i className="icon-dot fs-10"></i>
                      </button>
                      <button className="btn btn-blue-line"
                        onClick={() => {
                          handleAddToCart(productDetails, quantity);
                          router.push("/cart");
                        }}
                      >
                        <span>Buy Now</span> <i className="icon-dot fs-10"></i>
                      </button>
                    </div>
                    {/* <div className="product-policy">
                      {productDetailsPageData.policies.map((policy) => (
                        <div key={policy.id} className="policy-list">
                          <i className={policy.iconClassName}></i> {policy.label}
                        </div>
                      ))}
                    </div>
                    <div className="product-payment">
                      <h4>Payment Options</h4>
                      <div className="product-payment-image">
                        <img
                          src={productDetailsPageData.paymentImageSrc}
                          alt={productDetailsPageData.paymentImageAlt}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="product-content-wrapper product-detail-tabs-section">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {/* <ul className="nav nav-tabs product-tab-nav" id="productTab" role="tablist">
                    {[descriptionTab, additionalInfoTab].map((tab, index) => (
                      <li key={tab.id} className="nav-item" role="presentation">
                        <button
                          className={`nav-link${index === 0 ? " active" : ""}`}
                          id={`product-tab-${tab.id}`}
                          data-bs-toggle="tab"
                          data-bs-target={`#product-cont-${tab.id}`}
                          type="button"
                          role="tab"
                          aria-controls={`product-cont-${tab.id}`}
                          aria-selected={index === 0}
                        >
                          {tab.title}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="tab-content product-tab-cont" id="myTabContent">
                    {[descriptionTab, additionalInfoTab].map((tab, index) => (
                      <div
                        key={tab.id}
                        className={`tab-pane fade${index === 0 ? " show active" : ""}`}
                        id={`product-cont-${tab.id}`}
                        role="tabpanel"
                        aria-labelledby={`product-tab-${tab.id}`}
                      >
                        <div className="product-tabs-item-content">
                          {tab.paragraphs.map((paragraph) => (
                            <p key={`${tab.id}-${paragraph}`}>{paragraph}</p>
                          ))}

                          {index === 0 ? (
                            <div className="trust-list">
                              {productDetailsPageData.trustItems.map((item) => (
                                <div key={item.id} className="trust-list-item">
                                  <i className={item.iconClassName}></i> {item.label}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div> */}

                  <div className="product-tabs-shell">
                    <div className="product-tabs-nav" role="tablist" aria-label="Product information">
                      <button
                        className={activeTab === "description" ? "active" : ""}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "description"}
                        onClick={() => setActiveTab("description")}
                      >
                        Description
                      </button>
                      <button
                        className={activeTab === "specifications" ? "active" : ""}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "specifications"}
                        onClick={() => setActiveTab("specifications")}
                      >
                        Specifications
                      </button>
                      <button
                        className={activeTab === "delivery" ? "active" : ""}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "delivery"}
                        onClick={() => setActiveTab("delivery")}
                      >
                        Delivery
                      </button>
                    </div>
                    <div className="product-tabs-item-content">
                      {activeTab === "description" && (
                        <>
                          <h2 className="fs-40 mb-4">Description</h2>
                          <p>{productDetails.longDescription || productDetails.shortDescription || "No additional description available for this product."}</p>
                          <div className="trust-list">
                            {productDetailsPageData.trustItems.map((item) => (
                              <div key={item.id} className="trust-list-item">
                                <i className={item.iconClassName}></i> {item.label}
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {activeTab === "specifications" && (
                        <>
                          <h2 className="fs-40 mb-4">Specifications</h2>
                          <ul className="product-spec-list">
                            <li><span>Category</span><strong>{productDetails.productCategoryName}</strong></li>
                            <li><span>SKU</span><strong>{productDetails.itemCode}</strong></li>
                            <li><span>Compatibility</span><strong>POS systems and hospitality counters</strong></li>
                            <li><span>Warranty</span><strong>6 months where applicable</strong></li>
                            <li><span>Status</span><strong>{productDetailsPageData.inventory}</strong></li>
                          </ul>
                        </>
                      )}

                      {activeTab === "delivery" && (
                        <>
                          <h2 className="fs-40 mb-4">Delivery</h2>
                          <p><strong>Nairobi:</strong> Same-day delivery is available for eligible orders placed during business hours.</p>
                          <p><strong>Outside Nairobi:</strong> Delivery typically takes 2-3 business days depending on location.</p>
                          <p><strong>Payment:</strong> M-Pesa, card, and cash on delivery options may be available at checkout.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 pt-100">
                  <hr />
                </div>
              </div>
            </div>
          </section>

          {relatedProducts.length > 0 && (
            <section className="related-products-section py-5">
              <div className="container">
                <div className="shop-section-header">
                  <div>
                    {/* <p className="shop-product-category mb-2">Recommended</p> */}
                    <h2 className="title fs-40 mb-0">You may also like</h2>
                  </div>
                </div>

                <div className="shop-product-grid">
                  {relatedProducts.map((product) => (
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
              </div>
            </section>
          )}

          {/* <SupportSection data={supportSectionDataForProduct} /> */}
        </>)}
    </>
  );
}
